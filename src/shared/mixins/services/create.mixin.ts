import { Injectable } from '@nestjs/common'
import { Mongo } from '../../entities/mongo.entity'
import { Constructor } from './mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createServiceMixin <D extends Mongo, P extends Partial<D>> () {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Injectable()
    class Mixin extends Base {
      create = async (data: P): Promise<D> => {
        // @ts-expect-error using lexical scoping to dynamically provide context
        return await this.model.create(new this.model(data)) // eslint-disable-line
      }
    }

    return Mixin
  }
  return mixinBuilder
}
