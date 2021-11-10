import { ChainUtil } from "../chain-util"
import { Transaction } from "./transaction"
import { INITAL_BALANCE } from "./config"
import { Blockchain } from "../blockchain/blockchain"

export class Wallet {
  balance: number
  keyPair
  publicKey: string

  constructor(secret) {
    this.balance = 100 // INITAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair(secret)
    this.publicKey = this.keyPair.getPublic("hex")
  }

  toString() {
    return `Wallet - 
      publicKey: ${this.publicKey}
      balance  : ${this.balance}`
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash).toHex()
  }

  createTransaction(to, amount, type, blockchain: Blockchain, transactionPool) {
    this.balance = this.getBalance(blockchain)
    console.log("this.balance in wallet createTransaction: ", this.balance)
    if (amount > this.balance) {
      console.log(
        `Amount: ${amount} exceeds the current balance: ${this.balance}`
      )
      return
    }
    let transaction = Transaction.newTransaction(this, to, amount, type)
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