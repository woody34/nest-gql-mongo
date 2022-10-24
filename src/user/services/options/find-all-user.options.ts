import { set } from 'lodash'
import { defaultOptionsFactory, FindAllPaginationServiceOptions } from 'src/shared/mixins/services/find-all.mixin'
import { PaginationFilterUserDto, PaginationSortUserDto } from 'src/user/dtos/user/pagination-find-all-user.dto'

export const findAllOptions: FindAllPaginationServiceOptions = {
  filterMutator: (findFilter: any, requestFilter: PaginationFilterUserDto, overrides?: any): void => {
    for (const prop in requestFilter) {
      switch (prop) {
        case 'name':
          set(findFilter, 'name', requestFilter.name)
          break
        case 'email':
          set(findFilter, 'email', requestFilter.email)
          break
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    defaultOptionsFactory().filterMutator!(findFilter, requestFilter, overrides)
  },

  sortMutator: (sort: PaginationSortUserDto, requestSort: PaginationSortUserDto): void => {
    for (const prop in requestSort) {
      switch (prop) {
        case 'name':
          set(sort, 'name', requestSort.name)
          break
        case 'email':
          set(sort, 'email', requestSort.email)
          break
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    defaultOptionsFactory().sortMutator!(sort, requestSort)
  }
}
