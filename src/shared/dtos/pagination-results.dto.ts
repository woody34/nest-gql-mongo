import { User } from "src/user/entities/user.entity"
import { Mongo } from "../entities/mongo.entity"
import { ObjectGql } from "../entity.decorator"

export abstract class FindAllResultsDto<ENTITY extends Mongo> {
  count: number
  results: ENTITY[]
}
