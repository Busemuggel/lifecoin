import { HTTP_PORT, TRANSACTION_THRESHOLD } from "../config"
import { logger } from "../lib/logger/logger"
import { Transaction } from "./transaction"

export class TransactionPool {
  transactions: Transaction[]

  constructor() {
    this.transactions = []
  }

  thresholdReached(): boolean {
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true
    } else {
      return false
    }
  }

  addTransaction(transaction: Transaction): boolean {
    this.transactions.push(transaction)
    if (this.transactions.length >= TRANSACTION_THRESHOLD) {
      return true
    } else {
      return false
    }
  }

  validTransactions(): Transaction[] {
    return this.transactions.filter(transaction => {
      if (!Transaction.verifyTransaction(transaction)) {
        logger.warn(
          `Port ${HTTP_PORT}- ` + `Invalid signature from ${transaction.id}`, [new Date()]
        )
        return
      }
      return transaction
    })
  }

  transactionExists(transaction: Transaction): Transaction {
    const exists = this.transactions.find(t => t.id === transaction.id)
    return exists
  }

  clear(): void {
    this.transactions = []
  }
}