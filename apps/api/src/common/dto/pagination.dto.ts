import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortDirection?: 'asc' | 'desc' | 'ASC' | 'DESC' = 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function buildPaginatedResponse<T>(
  items: T[],
  total: number,
  page = 1,
  pageSize = 20,
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / pageSize) || 1;
  return {
    data: items,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

