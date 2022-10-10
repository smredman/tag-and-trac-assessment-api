import { Router } from "express";
import { AccountType } from "../../models/account.model";
import { validateToken } from "../../node-app-engine/http/middleware";
import { checkAccountType } from "../../node-app-engine/http/middleware/check-account-type.middleware";
import { RouterRegister } from "../../node-app-engine/http/routes";
import * as ShipmentsCtrl from '../controllers/shipments.controller';

export class ShipmentsRouter implements RouterRegister {

    register(): Router {
        const router = Router();

        router
            .get('/', [validateToken()], ShipmentsCtrl.list.bind(this))
            .post('/', [validateToken()], ShipmentsCtrl.create.bind(this))
            .patch('/:id', [validateToken()], ShipmentsCtrl.patch.bind(this))
            .delete('/:id', [validateToken(), checkAccountType([AccountType.Customer])], ShipmentsCtrl.remove.bind(this));

        return router;
    }

}