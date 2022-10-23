import { set } from "lodash"
import { FindAllPaginationServiceOptions, defaultOptionsFactory } from "src/shared/mixins/services/find-all.mixin"
import { PaginationFilterUserDto, PaginationSortUserDto } from "src/user/dtos/user/pagination-find-all-user.dto"

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

        defaultOptionsFactory().filterMutator(findFilter, requestFilter, overrides)
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
        defaultOptionsFactory().sortMutator(sort, requestSort)
    },
}