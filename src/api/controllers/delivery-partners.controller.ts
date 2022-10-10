import { NextFunction, Request, Response } from "express"; 
import { AccountType } from "../../models/account.model";
import { logError } from "../../node-app-engine/logging/logger";
import * as AccountsSvc from '../services/accounts.service';

export const list = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const accounts = await AccountsSvc.listByAccountType(AccountType.DeliveryPartner);
        res.json(accounts);
    }
    catch (err) {
        logError(err);
        next(err);
    }
};