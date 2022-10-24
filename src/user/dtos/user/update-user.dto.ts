import { PartialType, InputType } from '@nestjs/graphql'
import { ObjectGql } from 'src/shared/entity.decorator'
import { User } from 'src/user/entities/user.entity'

@ObjectGql()
export class UpdateUserDto extends PartialType(User, InputType) { }
