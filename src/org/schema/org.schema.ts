import { SchemaFactory } from "@nestjs/mongoose"
import { Org } from "../entities/org.entity"

export const OrgSchema = SchemaFactory.createForClass(Org)
OrgSchema.index({
  name: 'text',
})
export type OrgDocument = Org & Document