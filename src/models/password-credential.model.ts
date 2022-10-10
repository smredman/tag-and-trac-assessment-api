import { DataTypes, Sequelize } from "sequelize";
import { Dto, ModelBase } from "./base.model";
import { User } from './user.model';

export interface PasswordCredentialDto extends Dto {
    password: string;
    salt: string;
    userId: string;
}

export class PasswordCredential extends ModelBase<PasswordCredentialDto> {

    static properties() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            salt: {
                type: DataTypes.STRING,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: User,
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
            modelName: 'passwordCredential'
        }
    }

}