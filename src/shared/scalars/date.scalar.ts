import { CustomScalar, Scalar } from '@nestjs/graphql'
import { Kind, ValueNode } from 'graphql'

@Scalar('Date', () => Date)
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type'

  parseValue (value: string): Date {
    return new Date(value)
  }

  serialize (value: Date): string {
    return value.toUTCString()
  }

  parseLiteral (ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    throw new Error(`${ast.kind} is not a date`)
  }
}
