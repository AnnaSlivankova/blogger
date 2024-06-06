import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class QueryParams {
  @IsOptional()
  @IsString()
  public searchEmailTerm: string | null = null;

  @IsOptional()
  @IsString()
  public searchLoginTerm: string | null = null;

  @IsOptional()
  @IsString()
  public searchNameTerm: string | null = null;

  @IsString()
  @IsOptional()
  public sortBy = 'createdAt';

  @IsEnum(SortDirection)
  @IsOptional()
  public sortDirection: SortDirection = SortDirection.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  public pageNumber = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  public pageSize = 10;

  public getSkipItemsCount() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}
