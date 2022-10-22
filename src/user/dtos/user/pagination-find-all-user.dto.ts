import { PaginationDto, PaginationFilterDto, PaginationSortDto } from "src/shared/dtos/pagination.dto"
import { ObjectGql, PropGql } from "src/shared/entity.decorator"

@ObjectGql()
export class PaginationSortUserDto extends PaginationSortDto {
  @PropGql({ type: Number, nullable: true })
  createdAt?: number

  @PropGql({ type: Number, nullable: true })
  updatedAt?: number

  @PropGql({ type: Number, nullable: true })
  name?: number

  @PropGql({ type: Number, nullable: true })
  email?: number
}

@ObjectGql()
export class PaginationFilterUserDto extends PaginationFilterDto {
  @PropGql({ type: String })
  name?: string

  @PropGql({ type: String })
  email?: string
}

@ObjectGql()
export class PaginationFindAllUserDto extends PaginationDto {
  @PropGql({ type: PaginationSortUserDto, nullable: true })
  sort?: PaginationSortUserDto

  @PropGql({ type: PaginationFilterUserDto, nullable: true })
  filter?: PaginationFilterUserDto
}
