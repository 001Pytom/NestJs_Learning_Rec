import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Flavor } from './flavor.entity/flavor.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn() // primary key, auto generate id and auto increment
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  // @Column('json', { nullable: true }) // because it is an array and we want to make it optional as well, save the data as json and make it optional
  // weve created flavour entity to state the type of relation instead of just using json
  @JoinTable()
  @ManyToMany(
    type => Flavor,
    flavor => flavor.coffees,
    {
      cascade: true
    }
  )
  flavors: Flavor[];
}
