import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/services/user.service';
import { DatabaseController } from './database.controller';
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { DatabaseService } from './database.service';

@Module({
    imports: [
      UserModule
    ],
    providers: [UserService]
  })
  export class DatabaseModule {
    static register (): DynamicModule {
      const controllers: ModuleMetadata['controllers'] = []
      const providers: ModuleMetadata['providers'] = [ConfigService]
  
      if (process.env.NODE_ENV !== 'production') {
        controllers.push(DatabaseController)
        providers.push(DatabaseService)
      }

      return {
        module: DatabaseModule,
        imports: [
          HttpModule
        ],
        controllers,
        providers
      }
    }
  }
  