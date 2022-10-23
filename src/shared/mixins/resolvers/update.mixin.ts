import { HttpException, HttpStatus } from "@nestjs/common"
import { Args, Mutation,  Resolver } from "@nestjs/graphql"
import { ObjectId } from "mongodb"
import { DynamicClassPropName } from "src/shared/decorators/dynamic-class-prop-name.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Constructor } from "../services/mixin.utils"

export function updateResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes, C extends new (...args: any[]) => any> (
    Model: D,
    Service: S,
    propertyName: P,
    UpdateDto: C
) {
    const propName = `update${propertyName}`
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
            // @ts-expect-error
            async [propName] (@Args('data') data: UpdateDto, orgId: string = '63548dd85de5a0148c842a78'): Promise<boolean> {
                //@ts-expect-error
              const model = await this.findUserById(orgId, String(data._id))
        
              if (!new ObjectId(model.orgId).equals(orgId)) {
                throw new HttpException('Update failed, wrong org', HttpStatus.FORBIDDEN)
              }
        
              return await this.service.update(data)
            }
        }
        return Mixin
    }
    return mixinBuilder
}
