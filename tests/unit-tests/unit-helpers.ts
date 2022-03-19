import { mockedTransactionOne, mockedTransactionTwo } from "../mocks/mocked-transaction"
import TransactionPool from "../../src/wallet/transaction-pool"

export const helpers = {
  transactionLoader(transactionPool: TransactionPool) {
    transactionPool.transactions.push(mockedTransactionOne,mockedTransactionTwo)
  }
}
