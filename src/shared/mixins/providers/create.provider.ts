import { Injectable } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { InjectModel } from '@nestjs/mongoose'
import { Model as MongoModel } from 'mongoose'
import { CreateUserDto } from '../../../user/dtos/user/create-user.dto'
import { User } from '../../../user/entities/user.entity'
import { DynamicClassPropName } from '../../decorators/dynamic-class-prop-name.decorator'
import { Mongo } from '../../entities/mongo.entity'
import { Constructor, mixin } from '../services/mixin.utils'

// NOTE: generic provider contract
interface CreateProviderBase<I, O> {
  create: (d: I) => Promise<O>
}

// NOTE: Mongo implementation of provider that fulfills generic provider contract CreateProviderBase
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createProviderMixin <CREATE_DTO, DATA extends Mongo> (Model: ThisType<DATA>) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function builder <T extends Constructor> (Base: T) {
    @Injectable()
    // @ts-expect-error
    class Mixin extends Base implements CreateProviderBase<CREATE_DTO, DATA> {
      constructor (
        // @ts-expect-error
        @InjectModel(Model.name) readonly model: MongoModel<DATA>
      ) {
        super()
      }

      create = async (data: CREATE_DTO): Promise<DATA> => {
        // eslint-disable-next-line new-cap
        return await this.model.create(new this.model(data))
      }
    }

    return Mixin
  }
  return builder
}

interface CreateServiceBase<I, O> {
  create: (d: I) => Promise<O>
}

// NOTE: Generic service implementation that knows nothing of mongo
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createServiceMixin <D, P> (provider: CreateProviderBase<P, D>) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function builder <T extends Constructor> (Base: T) {
    @Injectable()
    class Mixin extends Base implements CreateServiceBase<P, D> {
      create = async (data: P): Promise<D> => {
        return await provider.create(data)
      }
    }

    return Mixin
  }
  return builder
}

// NOTE: Some testing
const ProviderMixin = createProviderMixin<CreateUserDto, User>(User)
const Provider = mixin(ProviderMixin)
const provider: CreateProviderBase<CreateUserDto, User> = new Provider({} as any)
const CreateServiceMixin = createServiceMixin(provider)

export class Service extends mixin(CreateServiceMixin) {
  async doACreate (data: CreateUserDto): Promise<User> {
    return await this.create(data)
  }
}

// NOTE: Not currently able to type resolvers as they are using dynamically created class prop names that are determined at runtime
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createResolverMixin (
  Model: any,
  CreateDto: any,
  Service: any,
  propertyName: string
) {
  const propName = `create${propertyName}`
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function mixinBuilder <T extends Constructor> (Base: T) {
    @Resolver(() => Model)
    // @ts-expect-error override tsc mixin rules
    class Mixin extends Base {
      constructor (
        public service: Service
      ) {
        super()
      }

      @DynamicClassPropName(propName)
      @Mutation(() => Model, { name: propName })
      async [propName] (@Args('data') data: typeof CreateDto): Promise<typeof Model> {
        return await this.service.create(data)
      }
    }
    return Mixin
  }
  return mixinBuilder
}
