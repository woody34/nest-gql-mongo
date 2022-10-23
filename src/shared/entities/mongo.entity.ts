import { ObjectId } from 'mongodb'
import { DocTypes } from '../enums/doc-types.enum'
import { DocumentGql, ObjectGql, PropGql } from '../entity.decorator'
import { Org } from 'src/org/entities/org.entity'

@ObjectGql()
export abstract class MongoDoc<DOC_TYPE = DocTypes> {
  @PropGql({ type: String })
  docType: DOC_TYPE
}

@DocumentGql()
export abstract class Mongo {
  @PropGql({ type: String, nullable: true, description: 'used for typing docs' })
  docType?: string

  @PropGql({ type: Boolean, default: false, description: 'used for soft deleting docs' })
  inactive: boolean

  @PropGql({ id: true, default: () => new ObjectId() })
  _id: ObjectId | string

  @PropGql({ id: true, ref: 'Org' })
  orgId: Org['_id']

  @PropGql({ type: Date })
  createdAt: Date

  @PropGql({ type: Date })
  updatedAt: Date
}
