import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { mixin } from 'src/shared/mixins/services/mixin.utils';
import { createServiceMixin } from 'src/shared/mixins/services/create.mixin';
import { findAllServiceMixin } from 'src/shared/mixins/services/find-all.mixin';
import { findByIdServiceMixin } from 'src/shared/mixins/services/find-by-id.mixin';
import { softDeleteServiceMixin } from 'src/shared/mixins/services/soft-delete.mixin';
import { updateServiceMixin } from 'src/shared/mixins/services/update.mixin';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { PaginationFindAllUserDto } from '../dtos/user/pagination-find-all-user.dto';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { User } from '../entities/user.entity';
import { findAllOptions } from './options/find-all-user.options';


@Injectable()
export class UserService extends mixin(
    findByIdServiceMixin<User>(),
    findAllServiceMixin<User, PaginationFindAllUserDto>(findAllOptions),
    createServiceMixin<User, CreateUserDto>(),
    updateServiceMixin<User, UpdateUserDto>(),
    softDeleteServiceMixin<User>()
) {
    constructor (
        @InjectModel(User.name) private readonly model: Model<User>
    ) {
        super()
    }

    // none crud services go here
}
