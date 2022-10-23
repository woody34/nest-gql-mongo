import { HttpException, HttpStatus } from "@nestjs/common"
import { Args, Mutation,  Resolver } from "@nestjs/graphql"
import { DynamicClassPropName } from "src/shared/decorators/dynamic-class-prop-name.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Constructor } from "../services/mixin.utils"

export function createResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes, C extends new (...args: any[]) => any> (
    Model: D,
    Service: S,
    propertyName: P,
    CreateDto: C
) {
    const propName = `create${propertyName}`
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
            @Mutation(() => Model, { name: propName })
            // @ts-expect-error
            async [propName] (@Args('data') data: CreateDto, orgId: string = '63548dd85de5a0148c842a78'): Promise<D> {
                if (data.orgId !== orgId) {
                    throw new HttpException('Create failed, wrong org', HttpStatus.FORBIDDEN)
                  }
                return await this.service.create(data)
            }
        }
        return Mixin
    }
    return mixinBuilder
}
