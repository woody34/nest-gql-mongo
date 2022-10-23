import { HttpException, HttpStatus } from "@nestjs/common"
import { Args, Mutation,  Resolver } from "@nestjs/graphql"
import { ObjectId } from "mongodb"
import { DynamicClassPropName } from "src/shared/decorators/dynamic-class-prop-name.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Constructor } from "../services/mixin.utils"

export function softDeleteResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes> (
    Model: D,
    Service: S,
    propertyName: P,
) {
    const propName = `softDelete${propertyName}`
    function mixinBuilder <T extends Constructor> (Base: T) {
        @Resolver(() => Model)
        // @ts-expect-error override tsc mixin rules
        class Mixin extends Base {
            constructor(
                // @ts-expect-error
                public service: Service
            ) {
                super()
            }
            @DynamicClassPropName(propName)
            @Mutation(() => Boolean, { name: propName })
            async [propName] (@Args('id') id: string, orgId: string = '63548dd85de5a0148c842a78'): Promise<boolean> {
              const payload = { _id: id, inactive: true }
              // @ts-ignore-error
              return this.updateUser(payload, orgId)
            }
        }
        return Mixin
    }
    return mixinBuilder
}
