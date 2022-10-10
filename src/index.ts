import { AuthenticationRouter } from "./api/routes/authentication.routes";
import { DeliveryPartnersRouter } from "./api/routes/delivery-partners.routes";
import { RegistrationRouter } from "./api/routes/registration.routes";
import { ShipmentsRouter } from "./api/routes/shipments.routes";
import { PostgresConnection } from "./node-app-engine/connections/postgres.connection";
import { Config } from "./node-app-engine/constants/config";
import { Logger } from "./node-app-engine/logging/logger";
import { NodeAppEngine } from "./node-app-engine/node-app-engine";
import { PostgresSchemaGenerator } from "./schemas/postgres-schema-generator";
import { SchemaSyncMode } from "./schemas/schema-generator";

Config.server.Name = 'Tag & Trac Assessment API';
Logger.defaultMeta.service = Config.server.Name;

const main = async() => {

    const pgConn = new PostgresConnection();

    const appEngine = new NodeAppEngine({
        routes: [
            {
                basePath: '/api/v1/registration',
                routes: new RegistrationRouter()
            },
            {
                basePath: '/api/v1/auth',
                routes: new AuthenticationRouter()
            },
            {
                basePath: '/api/v1/shipments',
                routes: new ShipmentsRouter()
            },
            {
                basePath: '/api/v1/delivery-partners',
                routes: new DeliveryPartnersRouter()
            }
        ],
        apiName: Config.server.Name,
        connections: [
            pgConn
        ],
        additionalSetup: async() => {
            const schemaGenerator = new PostgresSchemaGenerator(pgConn.getClient());
            await schemaGenerator.generate();
            await schemaGenerator.sync(SchemaSyncMode.SyncOnly);
        }
    });

    await appEngine.start();

};

main();