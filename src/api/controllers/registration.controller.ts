import { NextFunction, Request, Response } from "express";
import { logError } from "../../node-app-engine/logging/logger";
import { ExpectedError } from "../../node-app-engine/util/expected-error";
import { RegistrationDto } from "../dtos/registration-request.dto";
import * as UsersSvc from '../services/users.service';
import * as AccountsSvc from '../services/accounts.service';
import * as PasswordCredsSvc from '../services/password-credentials.service';
import { createJwt } from "../../node-app-engine/util/cryptography";

export const registerAccount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as RegistrationDto;
        const userDto = dto.user;
        const existingUser = await UsersSvc.findByEmail(userDto.email);
        if (existingUser) {
            throw new ExpectedError(409, 'User already exists');
        }
        const account = await AccountsSvc.create(dto.account);
        const user = await UsersSvc.create({...userDto, accountId: account.get().id});
        const creds = await PasswordCredsSvc.create(user.get().id, dto.password);
        const jwt = await createJwt({user: user.get(), account: account.get()});
        res.json({
            user: user.get(),
            account: account.get(),
            jwt: jwt
        });
    }
    catch (err) {
        logError(err);
        next(err);
    }
};