import { SchemaFactory } from '@nestjs/mongoose'
import { CreateUserDto } from '../dtos/user/create-user.dto'

export const CreateUserSchema = SchemaFactory.createForClass(CreateUserDto)
