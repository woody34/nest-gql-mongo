import { Module } from '@nestjs/common';
import { OrgService } from './services/org.service';
import { OrgResolver } from './resolvers/org.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Org } from './entities/org.entity';
import { OrgSchema } from './schema/org.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }]),
  ],
  providers: [OrgService, OrgResolver]
})
export class OrgModule {}
