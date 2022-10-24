import { Resolver } from '@nestjs/graphql'
import { DocTypes } from 'src/shared/enums/doc-types.enum'
import { createResolverMixin } from 'src/shared/mixins/resolvers/create.mixin'
import { findAllResolverMixin } from 'src/shared/mixins/resolvers/find-all.mixin'
import { findByIdResolverMixin } from 'src/shared/mixins/resolvers/find-by-id.mixin'
import { softDeleteResolverMixin } from 'src/shared/mixins/resolvers/soft-delete.mixin'
import { updateResolverMixin } from 'src/shared/mixins/resolvers/update.mixin'
import { mixin } from 'src/shared/mixins/services/mixin.utils'
import { CreateUserDto } from '../dtos/user/create-user.dto'
import { FindAllResultsUserDto, PaginationFindAllUserDto } from '../dtos/user/pagination-find-all-user.dto'
import { UpdateUserDto } from '../dtos/user/update-user.dto'
import { User } from '../entities/user.entity'
import { UserService } from '../services/user.service'

const findByIdMixin = findByIdResolverMixin(User, UserService, DocTypes.User)
const findAllMixin = findAllResolverMixin(User, UserService, DocTypes.User, PaginationFindAllUserDto, FindAllResultsUserDto)
const createMixin = createResolverMixin(User, UserService, DocTypes.User, CreateUserDto)
const updateMixin = updateResolverMixin(User, UserService, DocTypes.User, UpdateUserDto)
const softDeleteMixin = softDeleteResolverMixin(User, UserService, DocTypes.User)

@Resolver()
export class UserResolver extends mixin(
  createMixin,
  findByIdMixin,
  updateMixin,
  softDeleteMixin,
  findAllMixin
) {
  constructor (
    private readonly userService: UserService
  ) {
    super(userService)
  }
}
