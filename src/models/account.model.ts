import { DataTypes, Sequelize } from "sequelize";
import { Dto, ModelBase } from "./base.model";

export enum AccountType {
    Customer = "customer",
    DeliveryPartner = "delivery-partner"
}

export interface AccountDto extends Dto {
    name: string;
    type: AccountType;
}

export class Account extends ModelBase<AccountDto> {

    static properties() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                allowNull: false,
                type: DataTypes.ENUM(AccountType.Customer, AccountType.DeliveryPartner)
            }
        };
    }

    static config(db: Sequelize) {
        return {
            sequelize: db,
            timestamps: true,
            paranoid: true,
            modelName: 'account'
        }
    }

}