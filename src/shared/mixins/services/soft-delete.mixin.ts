import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Mongo } from '../../entities/mongo.entity'
import { Constructor } from './mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function softDeleteServiceMixin <D extends Mongo> () {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Injectable()
    class Mixin extends Base {
      softDelete = async (id: D['_id']): Promise<boolean> => {
        if (id == null) {
          throw new HttpException(`Unable to delete ${this.constructor.name} with no id`, HttpStatus.BAD_REQUEST)
        }
        // @ts-expect-error using lexical scoping to dynamically provide context
        const result = await this.model.updateOne({ _id: id }, { inactive: true })
        return result.modifiedCount === 1
      }
    }

    return Mixin
  }
  return mixinBuilder
}
