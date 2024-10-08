'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

/**
 * Workload module for the benchmark round.
 */
class ReadRecordTxWorkload extends WorkloadModuleBase {
  /**
   * Initializes the workload module instance.
   */
  constructor() {
    super();
    this.txIndex = 0;
    this.txAccessIndex = 0;
    this.limitIndex = 0;
  }

  /**
   * Initialize the workload module with the given parameters.
   * @param {number} workerIndex The 0-based index of the worker instantiating the workload module.
   * @param {number} totalWorkers The total number of workers participating in the round.
   * @param {number} roundIndex The 0-based index of the currently executing round.
   * @param {Object} roundArguments The user-provided arguments for the round from the benchmark configuration file.
   * @param {BlockchainInterface} sutAdapter The adapter of the underlying SUT.
   * @param {Object} sutContext The custom context object provided by the SUT adapter.
   * @async
   */
  async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
    await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

    this.limitIndex = this.roundArguments.assets;
  }

  /**
   * Assemble TXs for the round.
   * @return {Promise<TxStatus[]>}
   */
  async submitTransaction() {
    this.txIndex++;
    this.txAccessIndex++;
    let recordId = this.txIndex.toString();
    let accessId = this.txAccessIndex.toString();

    let args = {
      contractId: 'medsky',
      contractVersion: '1.0',
      contractFunction: 'ReadRecordTx',
      contractArguments: [
        'Client' + this.workerIndex + '_RECORD' + recordId,
        'Client' + this.workerIndex + '_ACCESS' + accessId
      ],
      timeout: 30,
    };

    if (this.txIndex === this.limitIndex) {
      this.txIndex = 0;
    }

    await this.sutAdapter.sendRequests(args);
  }
}

/**
 * Create a new instance of the workload module.
 * @return {WorkloadModuleInterface}
 */
function createWorkloadModule() {
  return new ReadRecordTxWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;