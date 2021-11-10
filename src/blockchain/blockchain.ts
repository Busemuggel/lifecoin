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
  chain = [Block.genesis()]
  accounts: Account = new Account() //Warning: check if account instance is needed
  stakes: Stake
  validators: Validators
  wallet: Wallet

  constructor(wallet: Wallet) {
    this.chain
    this.wallet = wallet
  }

  public addBlock(data) {
    console.log("in addblock: ", data)
    const block = Block.createBlock(this.chain[this.chain.length-1], data, this.wallet)
    console.log("in addblock after createBlock: ")
    this.chain.push(block)
    console.log("affter chain push: ")
    
    return block
  }

  isValidChain(chain) {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false

      for(let i = 1; i < chain.length; i++) {
        const block = chain[i]
        const lastBlock = chain[i-1]
        if((block.lastHash !== lastBlock.hash) || (
          block.hash !== Block.blockHash(block)))
        return false
      }

    return true
  }
  
  replaceChain(newChain){
    if(newChain.length <= this.chain.length) {
      console.log("Recieved chain is not longer than the current chain")
      return
    } else if(!this.isValidChain(newChain)) {
      console.log("Recieved chain is invalid")
      return
    }
    console.log("Replacing the current chain with new chain")
    this.chain = newChain
  }

  getBalance(publicKey) {
    return this.accounts.getBalance(publicKey)
  }

  getLeader() {
    return this.stakes.getMax(this.validators.list);
  }

  createBlock(transactions, wallet) {
    const block = Block.createBlock(
      this.chain[this.chain.length - 1],
      transactions,
      wallet
    )
    return block;
  }

  isValidBlock(block) {
    console.log("in isValidBlock")
    const lastBlock = this.chain[this.chain.length - 1]
    /**
     * check hash
     * check last hash
     * check signature
     * check leader
     */
    if (
      block.lastHash === lastBlock.hash &&
      block.hash === Block.blockHash(block) // &&
      // Block.verifyBlock(block) &&
      // Block.verifyLeader(block, this.getLeader())
    ) {
      console.log("block valid")
      this.addBlock(block)
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

}