import { registerEnumType } from "@nestjs/graphql";

export enum DocTypes {
    User = 'User',
    Org = 'Org',
    Role = 'Role'
}
registerEnumType(DocTypes, { name: 'DocTypes' })