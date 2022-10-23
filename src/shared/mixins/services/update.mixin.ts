import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { Mongo } from "../../entities/mongo.entity"
import { Constructor } from "./mixin.utils"

export function updateServiceMixin <D extends Mongo, P extends Partial<D>> () {
    function mixinBuilder <T extends Constructor> (Base: T) {
        @Injectable()
        class Mixin extends Base {    
            update = async (data: P): Promise<boolean> => {
                // @ts-expect-error using lexical scoping to dynamically provide context
                const result = await this.model.updateOne({ _id: data._id }, data)
                const success = result.modifiedCount === 1
                if (!success) {
                    throw new HttpException(`Failed to update ${String(this.constructor.name)}`, HttpStatus.BAD_REQUEST)
                }
                return success
            }
        }
    
        return Mixin
    }
    return mixinBuilder
}