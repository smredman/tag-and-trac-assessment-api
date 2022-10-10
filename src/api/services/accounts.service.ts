import { Account, AccountDto, AccountType } from '../../models/account.model';

export const create = async(dto: AccountDto): Promise<Account> => {
    const account = await Account.create({
        ...dto
    });
    return account;
};

export const listByAccountType = async(accountType: AccountType): Promise<Account[]> => {
    const accounts = await Account.findAll({
        where: {
            type: accountType
        }
    });
    return accounts;
};