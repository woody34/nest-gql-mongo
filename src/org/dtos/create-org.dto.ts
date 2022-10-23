import { InputType, PickType } from "@nestjs/graphql";
import { Org } from "src/org/entities/org.entity";
import { ObjectGql } from "src/shared/entity.decorator";

@ObjectGql()
export class CreateOrgDto extends PickType(Org, ['name', 'timezone'], InputType) {}
