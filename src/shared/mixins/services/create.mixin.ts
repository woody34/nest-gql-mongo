import { Injectable } from "@nestjs/common"
import { Model } from "mongoose"
import { Mongo } from "../../entities/mongo.entity"
import { Constructor } from "./mixin.utils"

export function createServiceMixin <D extends Mongo, P extends Partial<D>> () {
    function mixinBuilder <T extends Constructor> (Base: T) {
        @Injectable()
        class Mixin extends Base {    
            create = async (data: P): Promise<D> => {
                // @ts-expect-error using lexical scoping to dynamically provide context
                return await this.model.create(new this.model(data))
            }
        }
    
        return Mixin
    }
    return mixinBuilder
}