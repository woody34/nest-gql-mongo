import { Injectable } from '@nestjs/common'
import { set } from 'lodash'
import { PaginationDto, PaginationFilterDto, PaginationSortDto } from 'src/shared/dtos/pagination.dto'
import { Mongo } from '../../entities/mongo.entity'
import { Constructor } from './mixin.utils'

export interface FindAllPaginationServiceOptions {
  filterMutator?: <F extends PaginationFilterDto, D extends Mongo>(findFilter: Record<keyof D, any>, requestFilter: F, overrides?: Record<keyof D, any>) => void
  sortMutator?: <S extends PaginationSortDto>(sort: S, requestSort: Partial<S>) => void
}

export const defaultOptionsFactory = (partial?: Partial<FindAllPaginationServiceOptions>): FindAllPaginationServiceOptions => ({
  filterMutator: <D extends Mongo, F extends PaginationFilterDto>(findFilter: Record<keyof D, any>, requestFilter: F, overrides?: Record<keyof D, any>): void => {
    for (const prop in requestFilter) {
      switch (prop) {
        case 'startDate':
          set(findFilter, 'createdAt.$gte', requestFilter.startDate)
          break
        case 'endDate':
          set(findFilter, 'createdAt.$lte', requestFilter.endDate)
          break
        case 'search':
          set(findFilter, '$text.$search', requestFilter.search)
          break
      }
    }

    for (const prop in overrides) {
      set(findFilter, prop, overrides[prop])
    }
  },

  sortMutator: <S extends PaginationSortDto>(sort: S, requestSort: S): void => {
    for (const prop in requestSort) {
      switch (prop) {
        case 'createdAt':
          set(sort, 'createdAt', requestSort.createdAt)
          break
        case 'updatedAt':
          set(sort, 'updatedAt', requestSort.updatedAt)
          break
        case 'inactive':
          set(sort, 'inactive', requestSort.inactive)
          break
      }
    }
  },
  ...partial
})

// eslint-disable-next-line
export function findAllServiceMixin <D extends Mongo, P extends PaginationDto> (options?: FindAllPaginationServiceOptions) {
  // eslint-disable-next-line
  function builder <T extends Constructor> (Base: T) {
    @Injectable()
    class Mixin extends Base {
      public defaultLimit: number = 1000

      findAll = async (pagination?: P, filterOverrides?: Record<keyof D, any>): Promise<{ count: number, results: D[] }> => {
        const mergedOptions = defaultOptionsFactory(options)
        const filter: any = { inactive: { $ne: true } }
        const sort = { updatedAt: -1 }
        if (pagination == null) {
          // @ts-expect-error using lexical scoping to dynamically provide context
          const results: R = await this.model
            .find(filter)
            .sort(sort)
            .limit(this.defaultLimit)

          return { count: results.length, results }
        }

        for (const prop in pagination) {
          switch (prop) {
            case 'filter': {
              // @ts-expect-error
              mergedOptions.filterMutator(filter, pagination.filter, filterOverrides)
              break
            }
            case 'sort': {
              // @ts-expect-error
              mergedOptions.sortMutator(sort, pagination?.sort)
              break
            }
          }
        }

        // @ts-expect-error using lexical scoping to dynamically provide context
        const count = await this.model
          .find(filter)
          .count()

        // @ts-expect-error using lexical scoping to dynamically provide context
        const results = await this.model
          .find(filter)
          .sort(sort)
          .skip(pagination?.skip ?? 0)
          .limit(pagination?.limit ?? this.defaultLimit)

        return { count, results }
      }
    }
    return Mixin
  }
  return builder
}
