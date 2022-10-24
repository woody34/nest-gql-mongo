import { PaginationDto, PaginationFilterDto, PaginationSortDto } from 'src/shared/dtos/pagination.dto'
import { ObjectGql, PropGql } from 'src/shared/entity.decorator'

@ObjectGql()
export class PaginationSortOrgDto extends PaginationSortDto {
  @PropGql({ type: Number, nullable: true })
    createdAt?: number

  @PropGql({ type: Number, nullable: true })
    updatedAt?: number

  @PropGql({ type: Number, nullable: true })
    name?: number
}

@ObjectGql()
export class PaginationFilterOrgDto extends PaginationFilterDto {
  @PropGql({ type: String })
    name?: string
}

@ObjectGql()
export class PaginationFindAllOrgDto extends PaginationDto {
  @PropGql({ type: PaginationSortOrgDto, nullable: true })
    sort?: PaginationSortOrgDto

  @PropGql({ type: PaginationFilterOrgDto, nullable: true })
    filter?: PaginationFilterOrgDto
}
