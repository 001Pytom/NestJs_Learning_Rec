import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeesDto } from 'src/coffess/dto/create-coffees.dto/create-coffees.dto';
import { UpdateCoffeeDto } from 'src/coffess/dto/update-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}
  // @Get()
  // findAll() {
  //   return 'This returns all coffees';
  // }

  // for nested urls  eg localhost:3000/coffees/flavors
  // @Get("flavors")
  // findAll() {
  // return   "This returns all coffees"
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // return `This returns #${id} coffees`;
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() CreateCoffeesDto: CreateCoffeesDto) {
    // return body;
    return this.coffeesService.create(CreateCoffeesDto);
  }

  // hnadling updates and delete , use put and pathc
  @Patch(':id')
  updates(@Param('id') id: string, @Body() UpdateCoffeeDto: UpdateCoffeeDto) {
    // return `This action updates an id of ${id} coffee`;
    return this.coffeesService.update(id, UpdateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return ` This action removes #${id} coffee`;
    return this.coffeesService.remove(id);
  }

  // for pagination
  @Get()
  findAll(@Query() paginationQuery) {
    // const { limit, offset } = paginationQuery;
    // return `This returns all coffees. limit: ${limit}, offset: ${offset}`;
    return this.coffeesService.findAll();
  }
}

//
