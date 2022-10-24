import { Args, Query, Resolver } from '@nestjs/graphql'
import { DynamicClassPropName } from 'src/shared/decorators/dynamic-class-prop-name.decorator'
import { DocTypes } from 'src/shared/enums/doc-types.enum'
import { Constructor } from '../services/mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function findByIdResolverMixin <D extends new (...args: any[]) => any, S extends new (...args: any[]) => any, P extends DocTypes> (
  Model: D,
  Service: S,
  propertyName: P
) {
  const propName = `find${propertyName}ById`
  interface findById {
    // @ts-expect-error
    [propName]: (id: string) => Promise<D>
  }
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Resolver(() => Model)
    // @ts-expect-error override tsc mixin rules
    class Mixin extends Base implements findById {
      constructor (
        // @ts-expect-error overide type to inject service
        public service: Service
      ) {
        super()
      }

      @DynamicClassPropName(propName)
      @Query(() => Model, { name: propName })
      async [propName] (@Args('id') id: string): Promise<D> {
        // eslint-disable-next-line @typescript-eslint/return-await
        return await this.service.findById(id)
      }
    }
    // @ts-expect-error
    return Mixin as Mixin & {
      // @ts-expect-error
      [propName]: (id: string) => Promise<D>
    }
  }
  return mixinBuilder
}
