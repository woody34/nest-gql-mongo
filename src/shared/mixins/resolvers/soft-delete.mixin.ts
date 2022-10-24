import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { DynamicClassPropName } from 'src/shared/decorators/dynamic-class-prop-name.decorator'
import { DocTypes } from 'src/shared/enums/doc-types.enum'
import { Constructor } from '../services/mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function softDeleteResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes> (
  Model: D,
  Service: S,
  propertyName: P
) {
  const propName = `softDelete${propertyName}`
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
      async [propName] (@Args('id') id: string): Promise<boolean> {
        const payload = { _id: id, inactive: true }
        // @ts-expect-error-error
        return this.updateUser(payload)
      }
    }
    return Mixin
  }
  return mixinBuilder
}
