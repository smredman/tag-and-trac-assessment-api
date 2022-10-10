import { NextFunction, Request, Response } from "express";
import { AccountDto, AccountType } from "../../models/account.model";
import { Shipment, ShipmentDto } from "../../models/shipment.model";
import { Config } from "../../node-app-engine/constants/config";
import { logError } from "../../node-app-engine/logging/logger";
import * as ShipmentsSvc from '../services/shipments.service';

export const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const dto = req.body as ShipmentDto;
        const shipment = await ShipmentsSvc.create(dto, req[Config.crypto.DecodedJwtKey].account);
        res.json(shipment);
    }
    catch (err) {
        logError(err);
        next(err);
    }
};

export const list = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const shipments = await ShipmentsSvc.list(req[Config.crypto.DecodedJwtKey].account);
        res.json(shipments);
    }
    catch (err) {
        logError(err);
        next(err);
    }
};

export const patch = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let shipment: Shipment;
        const account: AccountDto = req[Config.crypto.DecodedJwtKey].account;
        if (account.type === AccountType.Customer) {
            shipment = await ShipmentsSvc.customerPatch(req.params.id, req.body, account);
        }
        else {
            shipment = await ShipmentsSvc.deliveryPartnerPatch(req.params.id, req.body, account);
        }
        res.json(shipment);
    }
    catch (err) {
        logError(err);
        next(err);
    }
};

export const remove = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const shipment = await ShipmentsSvc.remove(req.params.id, req[Config.crypto.DecodedJwtKey].account);
        res.json(shipment);
    }
    catch (err) {
        logError(err);
        next(err);
    }
};