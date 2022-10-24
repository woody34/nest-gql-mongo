import { applyDecorators } from '@nestjs/common'
import { Field, FieldOptions, ID, InputType, ObjectType, ObjectTypeOptions } from '@nestjs/graphql'
import { Prop, PropOptions as MongoosePropOptions, Schema, SchemaOptions } from '@nestjs/mongoose'
import { GraphQLScalarType } from 'graphql/type'
import { set } from 'lodash'
import mongoose, { Types } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
import { DateScalar } from './scalars/date.scalar'

interface CollectionOptions {
  description?: string
  collection?: string
  autoCreate?: boolean
}

export function DocumentGql (options?: CollectionOptions, mongooseSchema: SchemaOptions = {}, gqlObjectTypeOptions: ObjectTypeOptions = {}): ReturnType<typeof applyDecorators> {
  const schemaOptions: Partial<SchemaOptions> = {
    timestamps: true,
    collection: options?.collection,
    autoCreate: options?.autoCreate
  }
  const objectTypeOptions: Partial<ObjectTypeOptions> = {}
  for (const key in options) {
    switch (key) {
      case 'description':
        set(schemaOptions, key, options.description)
        set(objectTypeOptions, key, options.description)
        // add more shared props here
    }
  }

  return (target: any) => {
    const schema = Schema({ ...mongooseSchema, ...schemaOptions })
    const objectType = ObjectType({ ...gqlObjectTypeOptions, ...objectTypeOptions })
    const inputType = InputType(`${String(target.name)}Input`)
    schema(target)
    objectType(target)
    inputType(target)
  }
}

export function ObjectGql (options?: CollectionOptions, gqlObjectTypeOptions: ObjectTypeOptions = {}): ReturnType<typeof applyDecorators> {
  const objectTypeOptions: Partial<ObjectTypeOptions> = {}
  for (const key in options) {
    switch (key) {
      case 'description':
        set(objectTypeOptions, key, options.description)
        break
        // add more shared props here
    }
  }

  return (target: any) => {
    const objectType = ObjectType({ ...gqlObjectTypeOptions, ...objectTypeOptions })
    const inputType = InputType(`${String(target.name)}Input`)
    objectType(target)
    inputType(target)
  }
}

// eslint-disable-next-line @typescript-eslint/prefer-function-type
interface Constructor extends Function { new (...args: any[]): any }

interface PropOptions {
  type?: Constructor | [Constructor] | GraphQLScalarType<unknown, unknown> | object
  description?: string
  default?: any
  unique?: boolean
  nullable?: boolean
  id?: boolean
  ref?: string
  idArray?: {
    ref: string
  }
  enumValues?: any[]
  uuid?: boolean
}

export function PropGql <P> (options?: PropOptions, mongooseProp: MongoosePropOptions<P> = {}, qglFieldOptions: FieldOptions = {}): ReturnType<typeof applyDecorators> {
  const propOptions: Partial<SchemaOptions> = {}
  const fieldOptions: Partial<ObjectTypeOptions> = {}

  for (const key in options) {
    switch (key) {
      case 'type':
        if (options.type instanceof Array) {
          set(propOptions, key, Array)
        } else if (options.type instanceof Date) {
          set(propOptions, key, DateScalar)
        } else {
          set(propOptions, key, options.type)
        }
        break
      case 'default':
        set(propOptions, key, options.default)
        set(fieldOptions, key, options.default)
        break
      case 'description':
        set(propOptions, key, options.description)
        set(fieldOptions, key, options.description)
        break
      case 'unique':
        set(propOptions, key, options.unique)
        set(fieldOptions, key, options.unique)
        break
      case 'nullable':
        set(propOptions, 'required', options.nullable !== true) // defaults a prop to required if null
        set(fieldOptions, key, options.nullable)
        break
      case 'enumValues':
        set(propOptions, 'type', String)
        set(propOptions, 'emum', options.enumValues) // defaults a prop to required if null
        break
      case 'id':
        set(propOptions, 'type', mongoose.Schema.Types.ObjectId)
        break
      case 'ref':
        set(propOptions, key, options.ref) // defaults a prop to required if null
        break
      case 'idArray':
        set(propOptions, 'type', [{ type: Types.ObjectId, ref: options.idArray?.ref }]) // defaults a prop to required if null
        break
      case 'uuid':
        // eslint-disable-next-line no-case-declarations
        const uuid = uuidv4()
        set(propOptions, 'type', String)
        set(propOptions, 'default', uuid)
        set(fieldOptions, 'defaultValue', uuid)
        break
    }
  }

  const fieldArgs: any[] = []
  if (options?.type !== undefined) {
    if (options.type instanceof Date) {
      fieldArgs.push(() => DateScalar)
    } else {
      fieldArgs.push(() => options.type)
    }
  }
  if (options?.id != null) {
    fieldArgs.length = 0
    fieldArgs.push(() => ID)
  }
  if (options?.idArray !== undefined) {
    fieldArgs.length = 0
    fieldArgs.push(() => [ID])
  }
  fieldArgs.push({ ...qglFieldOptions, ...fieldOptions })

  return (target: any, key: any) => {
    const props = Prop({ ...propOptions, ...mongooseProp })
    const field = Field(...fieldArgs)
    props(target, key)
    field(target, key)
  }
}
