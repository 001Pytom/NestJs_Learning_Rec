import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeesDto } from "../create-coffees.dto/create-coffees.dto";

export class UpdateCoffeeDto extends PartialType(CreateCoffeesDto) {} 
// pario=ial helps u se akk the oroperties to Optional