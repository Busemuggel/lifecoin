import 'jest'
import { TEST_ADDRESS } from '../../mocks/mocked-address'
import { FIRST_LEADER, TRANSACTION_TYPE } from '../../../src/config'
import Transaction from '../../../src/wallet/transaction'
import ChainUtil from '../../../src/chain-util'
import * as nativeWallet from '../../../src/wallet/wallet'
import { mockedTransactionOne } from '../../mocks/mocked-transaction'

const mockedWallet = nativeWallet as jest.Mocked<typeof nativeWallet>

describe('Transaction', () => {
  const wallet = new mockedWallet.default(FIRST_LEADER)

  beforeEach(() => {
    wallet.balance = 5000
    jest.clearAllMocks()
  })

  it('should create a new transaction if the balance is less then the amount', async () => {
    const spy1 = jest.spyOn(Transaction, 'generateTransaction')
    const spy2 = jest.spyOn(Transaction, 'signTransaction')
    const spy3 = jest.spyOn(wallet, 'sign')
    const spy4 = jest.spyOn(ChainUtil, 'hash')

    const result = Transaction.newTransaction(wallet, TEST_ADDRESS, 200, TRANSACTION_TYPE.Transaction)
    const result2 = Transaction.newTransaction(
      wallet, 
      TEST_ADDRESS, 
      7000, 
      TRANSACTION_TYPE.Transaction
    )

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(Transaction)
    expect(result2).toBe(undefined)
  })

  it('should verify a transaction', async () => {
    const spy1 = jest.spyOn(ChainUtil, 'verifySignature')
    const spy2 = jest.spyOn(ChainUtil, 'hash')

    const result = Transaction.verifyTransaction(mockedTransactionOne)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(result).toBe(true)
  })
})
