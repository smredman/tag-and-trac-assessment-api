import { Router } from "express";
import { validateToken } from "../../node-app-engine/http/middleware";
import { RouterRegister } from "../../node-app-engine/http/routes";
import * as AuthCtrl from '../controllers/authentication.controller';

export class AuthenticationRouter implements RouterRegister {

    register(): Router {
        const router = Router();

        router 
            .get('/refresh', [validateToken()], AuthCtrl.refreshJwt.bind(this))
            .post('/login', AuthCtrl.logIn.bind(this));

        return router;
    }

}