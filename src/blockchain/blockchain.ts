import { FIRST_LEADER, HTTP_PORT, TRANSACTION_TYPE } from "../config"
import { logger } from "../lib/logger/logger"
import Transaction from "../wallet/transaction"
import Wallet from "../wallet/wallet"
import Account from "./account"
import Block from "./block"
import Stake from "./stake"
import Validators from "./validator"

export default class Blockchain {
  chain: Array<Block>
  stakes: Stake
  accounts: Account
  validators: Validators

  constructor() {
    this.chain = [Block.genesis()]
    this.stakes = new Stake()
    this.accounts = new Account()
    this.validators = new Validators()
  }

  public addBlock(data: Transaction[]): Block {
    const block = Block.createBlock(
      this.chain[this.chain.length-1], 
      data, 
      new Wallet(FIRST_LEADER)
    )
    this.chain.push(block)
    logger.info(`Port ${HTTP_PORT}- ` + 'Block is valid')
    return block
  }

  createBlock(transactions: Transaction[], wallet: Wallet): Block {
    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      transactions,
      wallet
    )
    return block
  }
  
  isValidChain(chain: Array<Block>): boolean {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

    for(let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i-1]
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) { return false }
    }

    return true
  }
  
  replaceChain(newChain: Array<Block>): void {
    if(newChain.length <= this.chain.length) {
      logger.info(`Port ${HTTP_PORT}- ` + 'Received chain is not longer than the current chain')
      return
    } else if(!this.isValidChain(newChain)) {
      logger.warn(`Port ${HTTP_PORT}- ` + 'Received chain is invalid', [new Date()])
      return
    }

    logger.info(`Port ${HTTP_PORT}- ` + 'Replacing the current chain with new chain')
    this.resetState()
    this.executeChain(newChain)
    this.chain = newChain
  }

  getBalance(publicKey: string): number {
    return this.accounts.getBalance(publicKey)
  }

  getLeader(): string {
    return this.stakes.getMax(this.validators.list)
  }

  initialize(address: string): void {
    this.accounts.initialize(address)
    this.stakes.initialize(address)
  }

  isValidBlock(block: Block): boolean {
    const lastBlock = this.chain[this.chain.length - 1]
    /**
     * check hash
     * check last hash
     * check signature
     * check leader
     */
    if (
      block.lastHash === lastBlock.hash &&
      block.hash === Block.blockHash(block) &&
      Block.verifyBlock(block) &&
      Block.verifyLeader(block, this.getLeader())
    ) {
      this.addBlock(block.data)
      this.executeTransactions(block)
      return true
    } else {
      return false
    }
  }

  executeTransactions(block: Block): void {
    block.data.forEach(transaction => {
      switch (transaction.type) {
        case TRANSACTION_TYPE.Transaction:
          this.accounts.transfer(transaction.input.from, transaction.output.to, transaction.output.amount)
          this.accounts.transferFee(transaction.input.from, block.validator, transaction.output.fee)
          break

        case TRANSACTION_TYPE.Stake:
          this.stakes.update(transaction)
          this.accounts.decrement(
            transaction.input.from,
            transaction.output.amount
          )
          this.accounts.transferFee(transaction.input.from, block.validator, transaction.output.fee)
          break

        case TRANSACTION_TYPE.Validator_fee:
          if (this.validators.update(transaction)) {
            this.accounts.decrement(
              transaction.input.from,
              transaction.output.amount
            )
            this.accounts.transferFee(transaction.input.from, block.validator, transaction.output.fee)
          }
          break
      }
    })
  }

  executeChain(chain: Array<Block>): void {
    chain.forEach(block => {
      this.executeTransactions(block)
    })
  }

  resetState(): void {
    this.chain = [Block.genesis()]
    this.stakes = new Stake()
    this.accounts = new Account()
    this.validators = new Validators()
  }
}