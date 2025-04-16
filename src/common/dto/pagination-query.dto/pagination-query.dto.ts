import { Type } from 'class-transformer';
import { IsOptional, isPositive, Validate } from 'class-validator';

export class PaginationQueryDto {
  //   @Type(() => Number)
  @IsOptional()
  @Validate(isPositive)
  limit: number;

  //   @Type(() => Number) //instead of this, go to main.ts and add transformOptions:{enableImplicitConverson:true}
  @IsOptional()
  @Validate(isPositive)
  offset: number;
}
