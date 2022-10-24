import { ObjectGql, PropGql } from '../entity.decorator'

@ObjectGql()
export abstract class PaginationFilterDto {
  @PropGql({ type: Date, nullable: true })
    startDate?: Date

  @PropGql({ type: Date, nullable: true })
    endDate?: Date

  @PropGql({ type: String, nullable: true })
    search?: string
}

@ObjectGql()
export abstract class PaginationSortDto {
  @PropGql({ type: Boolean, nullable: true })
    inactive?: boolean

  @PropGql({ type: Number, nullable: true })
    createdAt?: number

  @PropGql({ type: Number, nullable: true })
    updatedAt?: number
}

@ObjectGql()
export abstract class PaginationDto {
  public static defaultLimit = 1000

  @PropGql({ type: Number, nullable: true, default: 0 })
    skip?: number

  @PropGql({ type: Number, nullable: true, default: PaginationDto.defaultLimit })
    limit?: number

  @PropGql({ type: Boolean, nullable: true })
    inactive?: boolean

  @PropGql({ type: PaginationSortDto, nullable: true })
    sort?: PaginationSortDto

  @PropGql({ type: PaginationSortDto, nullable: true })
    filter?: PaginationFilterDto
}
