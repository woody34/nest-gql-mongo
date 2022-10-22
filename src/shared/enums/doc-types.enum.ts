import { registerEnumType } from "@nestjs/graphql";

export enum DocTypes {
    User = 'User',
    Role = 'Role'
}
registerEnumType(DocTypes, { name: 'DocTypes' })