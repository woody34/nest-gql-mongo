import { Mongo, MongoDoc } from "src/shared/entities/mongo.entity"
import { DocumentGql, PropGql } from "src/shared/entity.decorator"
import { DocTypes } from "src/shared/enums/doc-types.enum"
import { Role } from "./role.entity"

@DocumentGql({ collection: 'users' })
export class User extends Mongo implements MongoDoc<DocTypes.User> {
  @PropGql({ type: DocTypes, default: DocTypes.User, enumValues: Object.values(DocTypes) })
  docType: DocTypes.User

  @PropGql({ type: String })
  email: string

  @PropGql({ type: String })
  name: string

  @PropGql({ type: String, description: 'follows moment/dayjs timezone name format' })
  timezone: string

  @PropGql({ idArray: { ref: 'Role' } })
  roleIds: Role['_id'][]
}
