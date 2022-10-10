import { AccountDto } from "../../models/account.model";
import { UserDto } from "../../models/user.model";

export interface AuthenticationResponseDto {
    account: AccountDto;
    user: UserDto;
    jwt: string;
}