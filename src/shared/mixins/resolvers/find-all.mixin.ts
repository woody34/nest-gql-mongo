import { Args, Query, Resolver } from "@nestjs/graphql"
import { DynamicClassPropName } from "src/shared/decorators/dynamic-class-prop-name.decorator"
import { FindAllResultsDto } from "src/shared/dtos/pagination-results.dto"
import { PaginationDto } from "src/shared/dtos/pagination.dto"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Constructor } from "../services/mixin.utils"

export function findAllResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes,  PAG extends new (...args: any[]) => any,  PAY extends new (...args: any[]) => any> (
    Model: D,
    Service: S,
    propertyName: P,
    pagination: PAG,
    results: PAY,
) {
    const propName = `findAll${propertyName}s`
    function mixinBuilder <T extends Constructor> (Base: T) {
        @Resolver(() => Model)
        // @ts-expect-error override tsc mixin rules
        class Mixin extends Base {
            constructor(
                // @ts-expect-error overide type to inject service
                public service: Service
            ) {
                super()
            }

            @DynamicClassPropName(propName)
            @Query(() => results, { name: propName })
            // @ts-expect-error
            async [propName] (orgId: string = '63548dd85de5a0148c842a78', @Args('pagination', { nullable: true }) pagination?: pagination): Promise<results> {
              return await this.service.findAll(orgId, pagination)
            }
        }
        return Mixin
    }
    return mixinBuilder
}
