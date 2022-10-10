import { Account } from "../../models/account.model";
import { User, UserDto } from "../../models/user.model";
import { ExpectedError } from "../../node-app-engine/util/expected-error";

export const create = async (dto: UserDto): Promise<User> => {
    const user = await User.create({
        ...dto
    });
    return user;
};

export const findByEmail = async (email: string, throwError = false): Promise<User> => {
    const user = await User.findOne({
        where: {
            email: email.toLowerCase()
        },
        include: [
            {
                model: Account,
                required: true
            }
        ]
    });
    if (throwError && !user) {
        throw new ExpectedError(404, 'User not found');
    }
    return user;
};

export const findById = async (userId: string, throwError = false): Promise<User> => {
    const user = await User.findOne({
        where: {
            id: userId
        },
        include: [
            {
                model: Account,
                required: true
            }
        ]
    });
    if (throwError && !user) {
        throw new ExpectedError(404, 'User not found');
    }
    return user;
};