import { DataTypes, Sequelize } from "sequelize";
import { Account } from "./account.model";
import { Dto, ModelBase } from "./base.model";

export enum ShipmentStatus {
    Pending = "pending",
    PickedUp = "picked-up",
    OutForDelivery = "out-for-delivery",
    Delivered = "delivered"
}

export interface ShipmentDto extends Dto {
    pickupLocation: string;
    dropOffLocation: string;
    totalItems: number;
    combinedItemWeight:number;
    itemsDescription: string;
    shipmentStatus: ShipmentStatus;
    deliveryPartnerAccountId: string;
    customerAccountId: string;
}

export class Shipment extends ModelBase<ShipmentDto> {

    static properties() {
        return {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4
            },
            pickupLocation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dropOffLocation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            totalItems: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            combinedItemWeight: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            itemsDescription: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            shipmentStatus: {
                type: DataTypes.ENUM(
                    ShipmentStatus.Pending,
                    ShipmentStatus.PickedUp,
                    ShipmentStatus.OutForDelivery,
                    ShipmentStatus.Delivered
                ),
                allowNull: false,
                defaultValue: ShipmentStatus.Pending
            },
            deliveryPartnerAccountId: {
                type: DataTypes.UUID,
                references: {
                    model: Account,
                    key: 'id'
                }
            },
            customerAccountId: {
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
            modelName: 'shipment'
        }
    }

}