import { Module } from '@nestjs/common'
import { UserService } from './services/user.service'
import { UserResolver } from './resolvers/user.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User } from './entities/user.entity'
import { UserSchema } from './schema/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  providers: [UserService, UserResolver],
  exports: [MongooseModule]
})
export class UserModule {}
