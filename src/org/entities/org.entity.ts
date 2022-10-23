import { Mongo, MongoDoc } from "src/shared/entities/mongo.entity"
import { DocumentGql, PropGql } from "src/shared/entity.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"

@DocumentGql({ collection: 'orgs' })
export class Org extends Mongo implements MongoDoc<DocTypes.Org> {
  @PropGql({ type: DocTypes, default: DocTypes.Org, enumValues: Object.values(DocTypes) })
  docType: DocTypes.Org

  @PropGql({ type: String })
  name: string

  @PropGql({ type: String, description: 'follows moment/dayjs timezone name format' })
  timezone: string
}
