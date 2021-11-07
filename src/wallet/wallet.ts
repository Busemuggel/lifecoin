import { ChainUtil } from "../chain-util"
import { Transaction } from "./transaction"
import { INITAL_BALANCE } from "../config"

export class Wallet {
  balance: number
  keyPair
  publicKey

  constructor(secret) {
    this.balance = INITAL_BALANCE
    this.keyPair = ChainUtil.genKeyPair(secret)
    this.publicKey = this.keyPair.getPublic("hex")
  }

  toString() {
    return `Wallet - 
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash)
  }

  createTransaction(to, amount, type, blockchain, transactionPool) {
    let transaction = Transaction.newTransaction(this, to, amount,                                                                                                    type);
    transactionPool.addTransaction(transaction)
    return transaction
  }

}