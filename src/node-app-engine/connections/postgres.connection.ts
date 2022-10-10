import { Connection, ConnectionType } from "./connection";
import * as sequelize from 'sequelize';
import { Logger } from "../logging/logger";
import { Sequelize } from "sequelize";
import { Config } from "../constants/config";

export class PostgresConnection implements Connection<sequelize.Sequelize> {

    static client: sequelize.Sequelize;
    isConnected: boolean;
    
    constructor() {
        PostgresConnection.client = new Sequelize(
            Config.database.Postgres.Database,
            Config.database.Postgres.User,
            Config.database.Postgres.Password,
            {
                host: Config.database.Postgres.Connection,
                dialect: 'postgres',
                port: Config.database.Postgres.Port
            }
        );
        this.isConnected = false;
    }

    async connect(): Promise<boolean> {
        try {
            Logger.info('Connecting to database...')
            if (!this.connected) {
                await PostgresConnection.client.authenticate();
            }
            this.isConnected = true;
            Logger.info('Database connection succeeded');
            return true;
        }
        catch (err) {
            Logger.error('Database connection failed');
            this.isConnected = false;
            return false;
        }
    }

    async close(): Promise<boolean> {
        try {
            Logger.info('Disconnecting from database...')
            if (this.connected) {
                await PostgresConnection.client.close();
            }
            this.isConnected = false;
            Logger.info('Successfully disconnected from database');
            return true;
        }
        catch (err) {
            this.isConnected = true;
            Logger.info('Failed to disconnect from database');
            return false;
        }
    }

    async connected(): Promise<boolean> {
        return this.isConnected;
    }

    getClient(): sequelize.Sequelize {
        return PostgresConnection.client;
    }

    type(): ConnectionType {
        return ConnectionType.Postgres;
    }

    async healthy(): Promise<boolean> {
        return this.connected();
    }

    

}