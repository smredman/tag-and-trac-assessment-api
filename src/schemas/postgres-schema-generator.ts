import { Sequelize } from "sequelize";
import { Account } from "../models/account.model";
import { PasswordCredential } from "../models/password-credential.model";
import { Shipment, ShipmentStatus } from "../models/shipment.model";
import { User } from "../models/user.model";
import { SchemaGenerator, SchemaSyncMode } from "./schema-generator";

export class PostgresSchemaGenerator implements SchemaGenerator {

    private db: Sequelize;

    constructor(db: Sequelize) {
        this.db = db;
    }

    async generate(): Promise<boolean> {
        try {
            Account.init(
                Account.properties(),
                Account.config(this.db)
            );

            User.init(
                User.properties(),
                User.config(this.db)
            );

            PasswordCredential.init(
                PasswordCredential.properties(),
                PasswordCredential.config(this.db)
            );

            Shipment.init(
                Shipment.properties(),
                Shipment.config(this.db)
            );

            Account.hasMany(User, {
                foreignKey: 'accountId'
            });

            User.belongsTo(Account, {
                foreignKey: 'accountId'
            });

            PasswordCredential.belongsTo(User, {
                foreignKey: 'userId'
            });

            User.hasOne(PasswordCredential, {
                foreignKey: 'userId'
            });

            Account.hasMany(Shipment, {
                foreignKey: 'deliveryPartnerAccountId'
            });

            Account.hasMany(Shipment, {
                foreignKey: 'customerAccountId'
            });

            Shipment.belongsTo(Account, {
                foreignKey: 'deliveryPartnerAccountId',
                as: 'deliveryPartner'
            });

            Shipment.belongsTo(Account, {
                foreignKey: 'customerAccountId',
                as: 'customerAccount'
            });

            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

    async sync(mode: SchemaSyncMode = SchemaSyncMode.SyncOnly): Promise<boolean> {
        try {
            let syncOptions: any;
            switch (mode) {
                case SchemaSyncMode.Force:
                    syncOptions = {force: true};
                    break;
                case SchemaSyncMode.Alter:
                    syncOptions = {alter: true};
                    break;
                default:
                    syncOptions = {}; 
            }

            await Account.sync(syncOptions);
            await User.sync(syncOptions);
            await PasswordCredential.sync(syncOptions);
            await Shipment.sync(syncOptions);

            return true;
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }

}