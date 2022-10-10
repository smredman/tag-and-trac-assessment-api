import { DataTypes, Sequelize } from 'sequelize';
import { Account } from './account.model';
import { Dto, ModelBase } from './base.model';

export interface UserDto extends Dto {
    firstName: string;
    lastName: string;
    email: string;
    accountId: string;

    account?: Account;
}

export class User extends ModelBase<UserDto> {

    static properties() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            accountId: {
                type: DataTypes.UUID,
                references: {
                    model: Account,
                    key: 'id'
                }
            }
        };
    }

    static config(db: Sequelize) {
        return {
            sequelize: db,
            timestamps: true,
            paranoid: true,
            modelName: 'user'
        }
    }

}

