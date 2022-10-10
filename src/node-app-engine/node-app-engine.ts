import { Connection, ConnectionRegistry } from "./connections/connection";
import { Express, RequestHandler, Request, Response, NextFunction } from "express";
import { Server } from "http";
import { RouterRegister } from "./http/routes";
import { Config } from "./constants/config";
import morgan from "morgan";
import { json } from "body-parser";
import cors from 'cors';
import { Logger } from "./logging/logger";
import express from 'express';
import { ExpectedError } from "./util/expected-error";

export interface Options {
    apiName?: string;
    port?: number;
    terminationTimeout?: number;
    optionsHeader?: string;
    connections?: Array<Connection<any>>;
    preMiddleware?: Array<RequestHandler>;
    routes?: Array<{basePath: string, routes: RouterRegister}>;
    postMiddleware?: Array<RequestHandler>;
    additionalSetup?: Function;
}

export class NodeAppEngine {

    private _app: Express;
    get app(): Express {
        return this._app;
    }

    private _server: Server;
    get server(): Server {
        return this._server;
    }

    private _options: Options;
    get options(): Options {
        return this._options;
    }

    constructor(options: Options = {}) {
        this._options = {
            apiName: Config.server.Name,
            port: Config.server.Port,
            terminationTimeout: Config.server.terminationTimeout,
            optionsHeader: "*",
            connections: [],
            preMiddleware: [
                cors(),
                morgan('combined'),
                json()
            ],
            routes: [],
            postMiddleware: [],
            additionalSetup: null,
            ...options
        };
    }

    async start(): Promise<Express> {
        try {
            this._app = express();
            await this.registerConnections();
            this.registerHeaderOptions();
            this.registerPreMiddleware();
            this.registerRoutes();
            this.registerHealthcheck();
            this.registerPostMiddleware();
            this.registerErrorHandler();
            this.executeAdditionalSetup();
            await this.startServer();
            return this.app;
        }
        catch (err) {
            Logger.error('Failed to start server');
            process.exit(1);
        }
    }

    async stop(): Promise<void> {
        this._server.close(async() => {
            await this.closeConnections();
            Logger.info('All external connections closed, gracefully shutting down');
            process.exit(0);
        });

        setTimeout(() => {
            Logger.error('Failed to close external connections in time, forcefully shutting down');
            process.exit(1);
        }, this.options.terminationTimeout);
    }

    protected async registerConnections(): Promise<void> {
        const connPromises = new Array<Promise<boolean>>();
        this.options.connections.forEach(c => {
            connPromises.push(c.connect());
        });
        const results = await Promise.all(connPromises);
        if (results.includes(false)) {
            const disconnectPromises = new Array<Promise<boolean>>();
            this.options.connections.forEach(c => {
                disconnectPromises.push(c.close());
            });
            setTimeout(() => {
                Logger.error("Failed to register external connections");
                process.exit(1);
            }, this.options.terminationTimeout);
            await Promise.all(disconnectPromises);
            Logger.error("Failed to register external connections");
            process.exit(1);
        }
        else {
            this.options.connections.forEach(c => ConnectionRegistry.add(c));
        }
    }

    protected async closeConnections(): Promise<void> {
        const promises = new Array<Promise<boolean>>();
        this.options.connections.forEach(c => promises.push(c.close()));
        const results = await Promise.all(promises);
        if (results.includes(false)) {
            Logger.error('Failed to close all external connections, forcefully shutting down');
            process.exit(1);
        }
    }

    protected registerHeaderOptions(): void {
        this.app.options(this.options.optionsHeader);
    }

    protected registerPreMiddleware(): void {
        this.options.preMiddleware.forEach(m => {
            this.app.use(m);
        });
    }

    protected registerRoutes(): void {
        this.options.routes.forEach(r => {
            this.app.use(r.basePath, r.routes.register());
        });
    }

    protected registerHealthcheck(): void {
        this.app.get('/healthcheck', async(req: Request, res: Response) => {
            const promises = new Array<Promise<boolean>>();
            this.options.connections.forEach(c => {
                promises.push(c.healthy());
            });
            const results = await Promise.all(promises);
            if (results.includes(false)) {
                res.sendStatus(500);
            }
            else {
                res.sendStatus(200);
            }
        });
    }

    protected registerPostMiddleware(): void {
        this.options.postMiddleware.forEach(m => {
            this.app.use(m);
        });
    }

    protected registerErrorHandler(): void {
        this.app.all("*", (req: Request, res: Response, next: NextFunction) => {
            next(new ExpectedError(404));
        });

        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            if (err instanceof ExpectedError) {
                res.status(err.code).send(err.message || "Internal server error").end();
            }
            else {
                res.status(500).send(err.messsage || "Internal server error").end();
            }
        });
    }

    protected async executeAdditionalSetup(): Promise<void> {
        if (typeof this.options.additionalSetup !== "function") {
            return;
        }
        await this.options.additionalSetup();
    }

    protected async startServer(): Promise<void> {
        this._server = this._app.listen(this.options.port, () => {
            Logger.info(`${this.options.apiName} is listening on port ${this.options.port}`);
        });

        process.on('SIGINT', async() => {
            await this.stop();
        });

        process.on('SIGTERM', async() => {
            await this.stop();
        });
    }


}       