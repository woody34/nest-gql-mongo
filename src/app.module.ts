import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { DatabaseModule } from './database/database.module'
import { MongoModule } from './mongo/mongo.module'
import { ConfigModule } from '@nestjs/config'
import { ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { OrgModule } from './org/org.module'

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    MongoModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      fieldResolverEnhancers: ['interceptors'],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      context: ({ req }) => ({ req }),
      formatError: (error: any) => {
        const errorObj = {
          message:
    error.extensions?.exception?.response?.message ?? error.message,
          code:
    error.extensions?.code ?? 'SERVER_ERROR',
          name: error.extensions?.exception?.name ?? error.name
        }
        return `GraphQL Error: ${String(errorObj.name)}, Message: ${String(errorObj.message)}`
      },
      cors: {
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
      }
    }),
    OrgModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
