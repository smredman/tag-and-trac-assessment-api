import { DataTypes, Model } from "sequelize";

export interface Dto {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class ModelBase<T> extends Model<T> {

    static properties(): any {
        return {};
    }

    static isBoolean(value: any): boolean {
        return (typeof value === "boolean") ? true : false;
    }

    static boolToNum(value: any): number {
        return value ? 1 : 0;
    }

    static idColumn(): any {
        return {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        };
    }

}