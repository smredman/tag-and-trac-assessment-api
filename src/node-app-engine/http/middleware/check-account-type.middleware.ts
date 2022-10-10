import { NextFunction, Request, RequestHandler, Response } from "express";
import { AccountType } from "../../../models/account.model";
import { Config } from "../../constants/config";
import { ExpectedError } from "../../util/expected-error";

export const checkAccountType = (accountTypes: AccountType[]): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const decoded = req[Config.crypto.DecodedJwtKey];
            if (!accountTypes.includes(decoded.account.type)) {
                throw new Error();
            }
            next();
        }
        catch (err) {
            next(new ExpectedError(403, err.message || "Forbidden"));
        }
    };
};