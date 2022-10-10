import { AccountDto } from "../../models/account.model";
import { UserDto } from "../../models/user.model";

export interface RegistrationDto {
    account: AccountDto;
    user: UserDto;
    password: string;
}