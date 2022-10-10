export enum SchemaSyncMode {
    SyncOnly = "sync-only",
    Force = "force",
    Alter = "alter"
}

export interface SchemaGenerator {
    generate(): Promise<boolean>;
    sync(mode: SchemaSyncMode): Promise<boolean>;
}