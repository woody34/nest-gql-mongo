import { Args, Query, Resolver } from '@nestjs/graphql'
import { DynamicClassPropName } from 'src/shared/decorators/dynamic-class-prop-name.decorator'
import { DocTypes } from 'src/shared/enums/doc-types.enum'
import { Constructor } from '../services/mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function findAllResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes, PAG extends new (...args: any[]) => any, PAY extends new (...args: any[]) => any> (
  Model: D,
  Service: S,
  propertyName: P,
  pagination: PAG,
  results: PAY
) {
  const propName = `findAll${propertyName}s`
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Resolver(() => Model)
    // @ts-expect-error override tsc mixin rules
    class Mixin extends Base {
      constructor (
        // @ts-expect-error overide type to inject service
        public service: Service
      ) {
        super()
      }

      @DynamicClassPropName(propName)
      @Query(() => results, { name: propName })
      // @ts-expect-error
      async [propName] (@Args('pagination', { nullable: true }) pagination?: pagination): Promise<results> {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.service.findAll(pagination)
      }
    }
    return Mixin
  }
  return mixinBuilder
}
