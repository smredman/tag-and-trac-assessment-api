import { NextFunction, Request, RequestHandler, Response } from "express";
import { ExpectedError } from "../../util/expected-error";
import { validateJwt as validate } from "../../util/cryptography";
import { Config } from "../../constants/config";

export const validateToken = (): RequestHandler => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try {
            const jwt = req.header("Authorization");
            const decoded = await validate(jwt);
            req[Config.crypto.DecodedJwtKey] = decoded;
            next(); 
        }
        catch (err) {
            next(new ExpectedError(403, err.message || "Unable to validate JWT"));
        }
    };
};  