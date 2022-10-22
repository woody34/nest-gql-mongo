import { Mongo, MongoDoc } from "src/shared/entities/mongo.entity"
import { DocumentGql, PropGql } from "src/shared/entity.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"

@DocumentGql({ collection: 'roles' })
export class Role extends Mongo implements MongoDoc<DocTypes.Role> {
  @PropGql({ type: DocTypes, default: DocTypes.Role, enumValues: Object.values(DocTypes) })
  docType: DocTypes.Role

  @PropGql({ type: String })
  name: string
}
