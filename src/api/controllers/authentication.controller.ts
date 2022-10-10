import { NextFunction, Request, Response } from "express";
import { logError } from "../../node-app-engine/logging/logger";
import { AuthenticationRequestDto } from "../dtos/authentication-request.dto";
import * as UsersSvc from '../services/users.service';
import * as PasswordCredsSvc from '../services/password-credentials.service';
import { createJwt, securePassword } from "../../node-app-engine/util/cryptography";
import { ExpectedError } from "../../node-app-engine/util/expected-error";
import { Config } from "../../node-app-engine/constants/config";
import { User } from "../../models/user.model";

export const logIn = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as AuthenticationRequestDto;
        const user = await UsersSvc.findByEmail(dto.email, true);
        const creds = await PasswordCredsSvc.findByUserId(user.get().id);
        const testPass = await securePassword(dto.password, creds.get().salt);
        if (testPass !== creds.get().password) {
            throw new ExpectedError(401, "Unauthorized");
        }
        const jwt = await createJwt({user: user.get(), account: user.get().account});
        res.json({
            user: user.get(),
            account: user.get().account,
            jwt: jwt
        });
    }
    catch (err) {
        logError(err);
        next(err);
    }
};

export const refreshJwt = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req[Config.crypto.DecodedJwtKey];
        const user = await UsersSvc.findById(decodedToken.user.id);
        const jwt = await createJwt({user: user.get(), account: user.get().account});
        res.json({
            user: user.get(),
            account: user.get().account,
            jwt: jwt
        });
    }
    catch (err) {
        logError(err);
        next(err);
    }
};