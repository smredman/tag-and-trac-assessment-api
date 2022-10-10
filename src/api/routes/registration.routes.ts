import { Router } from "express";
import { RouterRegister } from "../../node-app-engine/http/routes";
import * as RegistrationCtrl from '../controllers/registration.controller';

export class RegistrationRouter implements RouterRegister {

    register(): Router {
        const router = Router();

        router
            .post('/', RegistrationCtrl.registerAccount.bind(this));

        return router;
    }

}