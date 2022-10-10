import { Router } from "express";
import { validateToken } from "../../node-app-engine/http/middleware";
import { RouterRegister } from "../../node-app-engine/http/routes";
import * as AccountsCtrl from '../controllers/delivery-partners.controller';

export class DeliveryPartnersRouter implements RouterRegister {

    register(): Router {
        const router = Router();

        router
            .get('/', [validateToken()], AccountsCtrl.list.bind(this));

        return router;

    }

}