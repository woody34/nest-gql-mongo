import { Mongo } from '../entities/mongo.entity'

export abstract class FindAllResultsDto<ENTITY extends Mongo> {
  count: number
  results: ENTITY[]
}
