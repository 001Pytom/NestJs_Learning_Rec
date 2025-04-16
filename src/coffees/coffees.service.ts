import {
  // HttpException,
  // HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { CreateCoffeesDto } from 'src/coffess/dto/create-coffees.dto/create-coffees.dto';
import { Repository , DataSource} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from 'src/coffess/dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';

@Injectable()
export class CoffeesService {
  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'Shipwreck Roast',
  //     brand: 'Buddy Brew',
  //     flavors: ['chocolate', 'vanilla'],
  //   },
  // ];
  // automatic generted db remove the dummy data
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly FlavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
   ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      take: limit, //brings out just the number of data u set
      skip: offset, //skips/removes the number of set data
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: ['flavors'],
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeesDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorsByName([name])),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors: flavors.flat(), // or flavors.reduce((acc, curr) => acc.concat(curr), [])
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (
        await Promise.all(
          updateCoffeeDto.flavors.map((name) =>
            this.preloadFlavorsByName([name]),
          ),
        )
      ).flat();

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

async recommendCoffe(coffee:Coffee){
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
  coffee.recommendations++;

  const recommendEvemt = new Event();
  recommendEvemt.name = 'recommend_coffee';
  recommendEvemt.type = 'coffee';
  recommendEvemt.payload = { coffeeId: coffee.id };
  await queryRunner.manager.save(coffee);
  await queryRunner.manager.save(recommendEvemt);
  
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction();
} finally {
  await queryRunner.release();
}

}

  private async preloadFlavorsByName(names: string[]): Promise<Flavor[]> {
    const existingFlavors = await this.FlavorRepository.find({
      where: names.map((name) => ({ name })),
    });

    const existingNames = existingFlavors.map((f) => f.name);

    const newFlavors = names
      .filter((name) => !existingNames.includes(name))
      .map((name) => this.FlavorRepository.create({ name }));

    return [...existingFlavors, ...newFlavors];
  }
}
