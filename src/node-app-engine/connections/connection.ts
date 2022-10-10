export enum ConnectionType {
    Postgres = "postgres"
}

export interface Connection<T> {

    connect(): Promise<boolean>;
    close(): Promise<boolean>;
    connected(): Promise<boolean>;
    getClient(): T;
    healthy(): Promise<boolean>;
    type(): ConnectionType;

}

export class ConnectionRegistry {

    private static connMap = new Map<ConnectionType, Connection<any>>();

    static add(conn: Connection<any>): void {
        ConnectionRegistry.connMap.set(conn.type(), conn);
    }

    static get(type: ConnectionType): Connection<any> {
        return ConnectionRegistry.connMap.get(type);
    }

}