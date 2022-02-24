import { ChainUtil } from "../chain-util"
import { Transaction } from "./transaction"
import { Blockchain } from "../blockchain/blockchain"
import { TransactionPool } from "./transaction-pool"

export class Wallet {
  balance: number
  keyPair
  publicKey: string

  constructor(secret: any) {
    this.balance // INITAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair(secret)
    this.publicKey = this.keyPair.getPublic("hex")
  }

  toString() {
    return `Wallet - 
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`
  }

  sign(dataHash: any) {
    return this.keyPair.sign(dataHash).toHex()
  }

  createTransaction(to: any, amount: any, type: any, blockchain: Blockchain, transactionPool: TransactionPool) {
    this.balance = this.getBalance(blockchain)
    if (amount > this.balance) {
      console.log(
        `Amount: ${amount} exceeds the current balance: ${this.balance}`
      )
      return
    }
    const transaction = Transaction.newTransaction(this, to, amount, type)
    transactionPool.addTransaction(transaction)
    return transaction
  }

  getBalance(blockchain: Blockchain) {
    return blockchain.getBalance(this.publicKey)
  }

  getPublicKey() {
    return this.publicKey
  }

}