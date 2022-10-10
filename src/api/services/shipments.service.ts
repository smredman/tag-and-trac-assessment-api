import { WhereOptions } from "sequelize";
import { Account, AccountDto, AccountType } from "../../models/account.model";
import { Shipment, ShipmentDto, ShipmentStatus } from "../../models/shipment.model";
import { ExpectedError } from "../../node-app-engine/util/expected-error";

export const create = async(dto: ShipmentDto, account: AccountDto): Promise<Shipment> => {
    const shipment = await Shipment.create({
        ...dto,
        shipmentStatus: ShipmentStatus.Pending,
        customerAccountId: account.id
    });
    return shipment;
};

export const list = async(account: AccountDto): Promise<Shipment[]> => {
    let where: WhereOptions = {
        deliveryPartnerAccountId: account.id
    };
    if (account.type === AccountType.Customer) {
        where = {
            customerAccountId: account.id
        };
    }
    const shipments = await Shipment.findAll({
        where: where,
        include: [
            {
                model: Account,
                foreignKey: 'customerAccountId',
                as: 'customerAccount'
            },
            {
                model: Account,
                foreignKey: 'deliveryPartnerAccountId',
                as: 'deliveryPartner'
            }
        ],
        order: [['updatedAt', 'desc'], ['createdAt', 'desc']]
    });
    return shipments;
};

export const customerPatch = async(shipmentId: string, dto: ShipmentDto, account: AccountDto): Promise<Shipment> => {
    const shipment = await Shipment.findOne({
        where: {
            id: shipmentId,
            customerAccountId: account.id
        }
    });
    if (!shipment) {
        throw new ExpectedError(404, 'Shipment not found');
    }
    if (shipment.get().shipmentStatus !== ShipmentStatus.Pending) {
        throw new ExpectedError(400, 'Shipment is no longer pending and cannot be updated');
    }
    shipment.set({
        ...dto,
        shipmentStatus: shipment.get().shipmentStatus
    });
    await shipment.save();
    return shipment;
};

export const deliveryPartnerPatch = async(shipmentId: string, dto: ShipmentDto, account: AccountDto): Promise<Shipment> => {
    const shipment = await Shipment.findOne({
        where: {
            id: shipmentId,
            deliveryPartnerAccountId: account.id
        }
    });
    if (!shipment) {
        throw new ExpectedError(404, 'Shipment not found');
    }
    shipment.set({
        ...shipment.get(),
        shipmentStatus: dto.shipmentStatus || shipment.get().shipmentStatus
    });
    await shipment.save();
    return shipment;
};

export const remove = async(shipmentId: string, account: AccountDto): Promise<Shipment> => {
    const shipment = await Shipment.findOne({
        where: {
            id: shipmentId,
            customerAccountId: account.id,
            shipmentStatus: ShipmentStatus.Pending
        }
    }); 
    if (!shipment) {
        throw new ExpectedError(400, "Shipment can longer be deleted because it is no longer pending");
    }
    await shipment.destroy();
    return shipment;
};