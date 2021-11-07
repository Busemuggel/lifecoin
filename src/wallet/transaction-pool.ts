import { Transaction } from "./transaction"

export class TransactionPool {
   transactions

  constructor() {
    this.transactions = []
  }

  addTransaction(transaction) {
    this.transactions.push(transaction)
  }

  validTransactions() {
    return this.transactions.filter(transaction => {
      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.data.from}`)
        return
      }

      return transaction
    })
  }

  transactionExists(transaction) {
    let exists = this.transactions.find(t => t.id === transaction.id)
    return exists
  }
}