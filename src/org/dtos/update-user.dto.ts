import { PartialType, InputType } from '@nestjs/graphql'
import { Org } from 'src/org/entities/org.entity'
import { ObjectGql } from 'src/shared/entity.decorator'

@ObjectGql()
export class UpdateOrgDto extends PartialType(Org, InputType) { }
