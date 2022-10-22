import { InputType, PickType } from "@nestjs/graphql";
import { ObjectGql } from "src/shared/entity.decorator";
import { User } from "../../entities/user.entity";

@ObjectGql()
export class CreateUserDto extends PickType(User, ['name', 'email', 'timezone'], InputType) {}
