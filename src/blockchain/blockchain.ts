import { FIRST_LEADER } from "../config"
import { Wallet } from "../wallet/wallet"
import { Account } from "./account"
import { Block } from "./block"
import { Stake } from "./stake"
import { Validators } from "./validator"

const TRANSACTION_TYPE = {
  stake: 'STAKE',
  transaction: 'TRANSACTION',
  validator_fee: "VALIDATOR_FEE"
}

export class Blockchain {
  chain
  stakes: Stake
  accounts: Account
  validators: Validators

  constructor() {
    this.chain = [Block.genesis()]
    this.stakes = new Stake()
    this.accounts = new Account()
    this.validators = new Validators()
  }

  public addBlock(data) {
    const block = Block.createBlock(
      this.chain[this.chain.length-1], 
      data, 
      new Wallet(FIRST_LEADER)
    )
    this.chain.push(block)
    return block
  }

  /*
  createBlock(transactions, wallet: Wallet) {
    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      transactions,
      wallet
    )
    return block
  }
  */
  
  isValidChain(chain) {
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
  
  replaceChain(newChain) {
    if(newChain.length <= this.chain.length) {
      console.log("Recieved chain is not longer than the current chain")
      return
    } else if(!this.isValidChain(newChain)) {
      console.log("Recieved chain is invalid")
      return
    }
    console.log("Replacing the current chain with new chain")
    this.resetState()
    this.executeChain(newChain)
    this.chain = newChain
  }

  getBalance(publicKey) {
    return this.accounts.getBalance(publicKey)
  }

  getLeader() {
    return this.stakes.getMax(this.validators.list)
  }

  initialize(address) {
    this.accounts.initialize(address)
    this.stakes.initialize(address)
  }

  isValidBlock(block: Block) {
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
      this.addBlock(block)
      console.log("block valid")
      this.executeTransactions(block)
      return true
    } else {
      return false
    }
  }

  executeTransactions(block) {
    block.data.forEach(transaction => {
      switch (transaction.type) {
        case TRANSACTION_TYPE.transaction:
          this.accounts.update(transaction)
          this.accounts.transferFee(block, transaction)
          break

        case TRANSACTION_TYPE.stake:
          this.stakes.update(transaction)
          this.accounts.decrement(
            transaction.input.from,
            transaction.output.amount
          )
          this.accounts.transferFee(block, transaction)
          break

        case TRANSACTION_TYPE.validator_fee:
          if (this.validators.update(transaction)) {
            this.accounts.decrement(
              transaction.input.from,
              transaction.output.amount
            )
            this.accounts.transferFee(block, transaction)
          }
          break
      }
    })
  }

  executeChain(chain) {
    chain.forEach(block => {
      this.executeTransactions(block)
    })
  }

  resetState() {
    this.chain = [Block.genesis()]
    this.stakes = new Stake()
    this.accounts = new Account()
    this.validators = new Validators()
  }

}