import { ChainUtil } from "../chain-util"
import { Transaction } from "./transaction"
import { Blockchain } from "../blockchain/blockchain"
import { TransactionPool } from "./transaction-pool"
import { eddsa } from "elliptic"
import { TRANSACTION_TYPE } from "../config"
import { logger } from "../lib/logger/logger"

export class Wallet {
  balance: number
  keyPair: eddsa.KeyPair
  publicKey: string

  constructor(secret: eddsa.Bytes) {
    this.balance // INITAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair(secret)
    this.publicKey = this.keyPair.getPublic("hex")
  }

  toString(): string {
    return `Wallet - 
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`
  }

  sign(dataHash: eddsa.Bytes): string {
    return this.keyPair.sign(dataHash).toHex()
  }

  createTransaction(
    to: string, 
    amount: number, 
    type: TRANSACTION_TYPE, 
    blockchain: Blockchain, 
    transactionPool: TransactionPool
  ): Transaction {
    this.balance = this.getBalance(blockchain)
    if (amount > this.balance) {
      logger.info(
        `Port ${process.env.HTTP_PORT} - `
        + `Amount: ${amount} exceeds the current balance of ${this.balance}`
      )
      return
    }
    const transaction = Transaction.newTransaction(this, to, amount, type)
    transactionPool.addTransaction(transaction)
    return transaction
  }

  getBalance(blockchain: Blockchain): number {
    return blockchain.getBalance(this.publicKey)
  }

  getPublicKey(): string {
    return this.publicKey
  }

}