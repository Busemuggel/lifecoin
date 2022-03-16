import 'jest'
import { mockedTransactionOne, mockedTransactionStake, mockedTransactionTwo } from '../../mocks/mocked-transaction'
import TransactionPool from '../../../src/wallet/transaction-pool'

describe('Transaction-Pool', () => {
  const transactionPool = new TransactionPool()

  const transactionLoader = (): void => {
    transactionPool.transactions.push(mockedTransactionOne,mockedTransactionTwo)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    transactionPool.transactions = []
  })

  it('should check if the threshold is reached', async () => {
    const spy = jest.spyOn(transactionPool, 'thresholdReached')
    transactionLoader()

    const result1 = transactionPool.thresholdReached()
    transactionPool.transactions.push(mockedTransactionStake)
    const result2 = transactionPool.thresholdReached()

    expect(spy).toHaveBeenCalledTimes(2)
    expect(result1).toBe(false)
    expect(result2).toBe(true)
  })

  it('should add a transaction', async () => {
    const spy = jest.spyOn(transactionPool, 'addTransaction')
    
    transactionPool.addTransaction(mockedTransactionOne)

    expect(spy).toHaveBeenCalled()
    expect(transactionPool.transactions).toEqual([mockedTransactionOne])
  })

  it('should check if a transaction exists in the pool', async () => {
    const spy = jest.spyOn(transactionPool, 'transactionExists')
    transactionLoader()
    
    const result1 = transactionPool.transactionExists(mockedTransactionOne)
    const result2 = transactionPool.transactionExists(mockedTransactionStake)

    expect(spy).toHaveBeenCalledTimes(2)
    expect(transactionPool.transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining(result1)
      ]))
    expect(result2).toBe(undefined)
  })

  it('should clear the transaction in the pool', async () => {
    const spy = jest.spyOn(transactionPool, 'clear')
    transactionLoader()

    transactionPool.clear()

    expect(spy).toHaveBeenCalled()
    expect(transactionPool.transactions).toEqual([])
  })
})
