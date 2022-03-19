import 'jest'
import { mockedTransactionOne, mockedTransactionStake, mockedTransactionTwo } from '../../mocks/mocked-transaction'
import TransactionPool from '../../../src/wallet/transaction-pool'
import { helpers } from '../../unit-tests/unit-helpers'

describe('Transaction-Pool', () => {
  const transactionPool = new TransactionPool()

  beforeEach(() => {
    transactionPool.transactions = []
  })

  it('should check if the threshold is reached', async () => {
    helpers.transactionLoader(transactionPool)

    const result1 = transactionPool.thresholdReached()
    transactionPool.transactions.push(mockedTransactionStake)
    const result2 = transactionPool.thresholdReached()

    expect(result1).toBe(false)
    expect(result2).toBe(true)
  })

  it('should add a transaction', async () => {
    transactionPool.addTransaction(mockedTransactionOne)

    expect(transactionPool.transactions).toEqual([mockedTransactionOne])
  })

  it('should check if a transaction exists in the pool', async () => {
    helpers.transactionLoader(transactionPool)
    
    const result1 = transactionPool.transactionExists(mockedTransactionOne)
    const result2 = transactionPool.transactionExists(mockedTransactionStake)

    expect(transactionPool.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining(result1)
      ]))
    expect(result2).toBe(undefined)
  })

  it('should clear the transaction in the pool', async () => {
    helpers.transactionLoader(transactionPool)

    transactionPool.clear()

    expect(transactionPool.transactions).toEqual([])
  })
})
