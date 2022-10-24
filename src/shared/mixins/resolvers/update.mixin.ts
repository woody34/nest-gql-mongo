import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { DynamicClassPropName } from 'src/shared/decorators/dynamic-class-prop-name.decorator'
import { DocTypes } from 'src/shared/enums/doc-types.enum'
import { Constructor } from '../services/mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function updateResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes, C extends new (...args: any[]) => any> (
  Model: D,
  Service: S,
  propertyName: P,
  UpdateDto: C
) {
  const propName = `update${propertyName}`
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Resolver(() => Model)
    // @ts-expect-error override tsc mixin rules
    class Mixin extends Base {
      constructor (
        // @ts-expect-error
        public service: Service
      ) {
        super()
      }

      @DynamicClassPropName(propName)
      @Mutation(() => Boolean, { name: propName })
      // @ts-expect-error
      async [propName] (@Args('data') data: UpdateDto): Promise<boolean> {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.service.update(data)
      }
    }
    return Mixin
  }
  return mixinBuilder
}
