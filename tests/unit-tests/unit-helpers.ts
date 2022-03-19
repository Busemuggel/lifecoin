import { mockedTransactionOne, mockedTransactionTwo } from "../mocks/mocked-transaction"
import TransactionPool from "../../src/wallet/transaction-pool"

export const helpers = {
  transactionLoader(transactionPool: TransactionPool): void {
    transactionPool.transactions.push(mockedTransactionOne,mockedTransactionTwo)
  }
}
