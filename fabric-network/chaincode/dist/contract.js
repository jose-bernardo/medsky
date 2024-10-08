"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedskyContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let MedskyContract = class MedskyContract extends fabric_contract_api_1.Contract {
    async AccessExists(ctx, accessId) {
        const accessJSON = await ctx.stub.getState(accessId);
        return accessJSON.length > 0;
    }
    async ReadAccesses(ctx, accessIdsJson) {
        const accessIds = JSON.parse(accessIdsJson);
        const accesses = [];
        for (const accessId of accessIds) {
            const accessJSON = await ctx.stub.getState(accessId);
            if (accessJSON.length === 0) {
                console.error(`The access log ${accessId} does not exist`);
                accesses.push('');
            }
            else {
                accesses.push(accessJSON.toString());
            }
        }
        return JSON.stringify(accesses);
    }
    async LogAccess(ctx, recordIds, accessId) {
        const exists = await this.AccessExists(ctx, accessId);
        if (exists) {
            throw new Error(`The access ${accessId} already exist`);
        }
        const access = {
            Requestor: ctx.stub.getCreator().idBytes.toString(),
            RecordIDs: recordIds,
        };
        return ctx.stub.putState(accessId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(access)), 'utf-8'));
    }
    async RecordExists(ctx, id) {
        const recordJSON = await ctx.stub.getState(id);
        return recordJSON.length > 0;
    }
    async ReadRecordsTx(ctx, recordIdsJson, accessId) {
        const records = [];
        const recordIds = JSON.parse(recordIdsJson);
        for (const recordId of recordIds) {
            const recordJSON = await ctx.stub.getState(recordId);
            if (recordJSON.length === 0) {
                records.push('');
                console.error(`The record ${recordId} does not exist`);
            }
            else {
                records.push(JSON.parse(recordJSON.toString()));
            }
        }
        await this.LogAccess(ctx, recordIds, accessId);
        return JSON.stringify(records);
    }
    async ReadRecordTx(ctx, recordId, accessId) {
        const recordJSON = await ctx.stub.getState(recordId);
        if (recordJSON.length === 0) {
            throw new Error(`The record ${recordId} does not exist`);
        }
        await this.LogAccess(ctx, [recordId], accessId);
        return recordJSON.toString();
    }
    async ReadRecords(ctx, recordIdsJson) {
        const recordIds = JSON.parse(recordIdsJson);
        const records = [];
        for (const recordId of recordIds) {
            const recordJSON = await ctx.stub.getState(recordId);
            if (recordJSON.length === 0) {
                console.error(`The record ${recordId} does not exist`);
                records.push('');
            }
            records.push(recordJSON.toString());
        }
        return JSON.stringify(records);
    }
    async CreateRecords(ctx, recordIdsJson, hashesJson) {
        const recordIds = JSON.parse(recordIdsJson);
        const hashes = JSON.parse(hashesJson);
        if (recordIds.length !== hashes.length) {
            throw new Error(`The number of record ids is different from the number of hashes`);
        }
        for (let i = 0; i < recordIds.length; i++) {
            const record = {
                Requestor: ctx.stub.getCreator().idBytes.toString(),
                Hash: hashes[i]
            };
            await ctx.stub.putState(recordIds[i], Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(record)), 'utf-8'));
        }
    }
    async CreateRecord(ctx, recordId, hash) {
        const record = {
            Requestor: ctx.stub.getCreator().idBytes.toString(),
            Hash: hash
        };
        await ctx.stub.putState(recordId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(record)), 'utf-8'));
    }
    async DeleteRecord(ctx, recordId, actionId) {
        const exists = await this.RecordExists(ctx, recordId);
        if (!exists) {
            throw new Error(`The record ${recordId} does not exist`);
        }
        await this.LogAccess(ctx, [recordId], actionId);
        return ctx.stub.deleteState(recordId);
    }
    async LogBadAction(ctx, badActionId, requestor, reason) {
        const badAction = {
            Requestor: requestor,
            Reason: reason
        };
        return ctx.stub.putState(badActionId, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(badAction))));
    }
};
exports.MedskyContract = MedskyContract;
__decorate([
    (0, fabric_contract_api_1.Returns)('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "AccessExists", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "ReadAccesses", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, Array, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "LogAccess", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    (0, fabric_contract_api_1.Returns)('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "RecordExists", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "ReadRecordsTx", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    (0, fabric_contract_api_1.Returns)('string'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "ReadRecordTx", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "ReadRecords", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "CreateRecords", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "CreateRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "DeleteRecord", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String, String]),
    __metadata("design:returntype", Promise)
], MedskyContract.prototype, "LogBadAction", null);
exports.MedskyContract = MedskyContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'Contract', description: 'Smart contract for managing medical records and log operations' })
], MedskyContract);
//# sourceMappingURL=contract.js.map