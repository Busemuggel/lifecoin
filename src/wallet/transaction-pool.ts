import { TRANSACTION_THRESHOLD } from "../config"
import { Transaction } from "./transaction"

export class TransactionPool {
  transactions: Transaction[]

  constructor() {
    this.transactions = []
  }

  thresholdReached() {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true
    } else {
      return false
    }
  }

  addTransaction(transaction: Transaction) {
    this.transactions.push(transaction)
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true
    } else {
      return false
    }
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.id}`)
        return
      }
      return transaction
    })
  }

  transactionExists(transaction: Transaction) {
    const exists = this.transactions.find(t => t.id === transaction.id)
    return exists
  }

  clear() {
    this.transactions = []
  }
}