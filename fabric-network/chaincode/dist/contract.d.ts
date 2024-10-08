import { Context, Contract } from 'fabric-contract-api';
export declare class MedskyContract extends Contract {
    AccessExists(ctx: Context, accessId: string): Promise<boolean>;
    ReadAccesses(ctx: Context, accessIdsJson: string): Promise<string>;
    LogAccess(ctx: Context, recordIds: string[], accessId: string): Promise<void>;
    RecordExists(ctx: Context, id: string): Promise<boolean>;
    ReadRecordsTx(ctx: Context, recordIdsJson: string, accessId: string): Promise<string>;
    ReadRecordTx(ctx: Context, recordId: string, accessId: string): Promise<string>;
    ReadRecords(ctx: Context, recordIdsJson: string): Promise<string>;
    CreateRecords(ctx: Context, recordIdsJson: string, hashesJson: string): Promise<void>;
    CreateRecord(ctx: Context, recordId: string, hash: string): Promise<void>;
    DeleteRecord(ctx: Context, recordId: string, actionId: string): Promise<void>;
    LogBadAction(ctx: Context, badActionId: string, requestor: string, reason: string): Promise<void>;
}
//# sourceMappingURL=contract.d.ts.map