import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ObjectId } from 'mongoose'
import { Mongo } from '../../entities/mongo.entity'
import { Constructor } from './mixin.utils'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function findByIdServiceMixin <D extends Mongo> () {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Injectable()
    class Mixin extends Base {
      findById = async (id: string | ObjectId): Promise<D> => {
        // @ts-expect-error using lexical scoping to dynamically provide context
        const model = await this.model.findOne({ _id: id })
        if (model == null) {
          // @ts-expect-error
          throw new HttpException(`${String(this.model.name)} not found`, HttpStatus.BAD_REQUEST)
        }
        return model
      }
    }

    return Mixin
  }
  return mixinBuilder
}
