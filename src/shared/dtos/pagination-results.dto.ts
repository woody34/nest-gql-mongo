import { User } from "src/user/entities/user.entity"
import { Mongo } from "../entities/mongo.entity"
import { ObjectGql } from "../entity.decorator"

@ObjectGql()
export abstract class PaginationResultsDto<ENTITY extends Mongo = Mongo> {
  count: number
  results: ENTITY[]
}
