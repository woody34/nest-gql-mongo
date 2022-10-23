import { HttpException, HttpStatus } from "@nestjs/common"
import { Args, Query, Resolver } from "@nestjs/graphql"
import { DynamicClassPropName } from "src/shared/decorators/dynamic-class-prop-name.decorator"
import { Mongo } from "src/shared/entities/mongo.entity"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Constructor } from "../services/mixin.utils"

export function findByIdResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes> (
    Model: D,
    Service: S,
    propertyName: P,
) {
    const propName = `find${propertyName}ById`
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
            @Query(() => Model, { name: propName })
            async [propName] (orgId: string = '63548dd85de5a0148c842a78', @Args('id') id: string): Promise<D> {
                return await this.service.findById(orgId, id)
            }
        }
        return Mixin
    }
    return mixinBuilder
}
