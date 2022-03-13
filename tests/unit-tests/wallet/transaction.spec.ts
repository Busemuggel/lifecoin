import 'jest'
import { TEST_ADDRESS } from '../blockchain/mocked-address'
import { FIRST_LEADER, TRANSACTION_TYPE } from '../../../src/config'
import Transaction from '../../../src/wallet/transaction'
import * as nativeWallet from '../../../src/wallet/wallet'
import { mockedTransactionOne } from '../blockchain/mocked-transaction'

const mockedWallet = nativeWallet as jest.Mocked<typeof nativeWallet>

describe('Transaction', () => {
  const wallet = new mockedWallet.default(FIRST_LEADER)

  beforeEach(() => {
    wallet.balance = 5000
  })

  it('should create a new transaction if the balance is less then the amount', async () => {
    const result = Transaction.newTransaction(wallet, TEST_ADDRESS, 200, TRANSACTION_TYPE.Transaction)
    const result2 = Transaction.newTransaction(
      wallet, 
      TEST_ADDRESS, 
      7000, 
      TRANSACTION_TYPE.Transaction
    )

    expect(result).toBeInstanceOf(Transaction)
    expect(result2).toBe(undefined)
  })

  it('should verify a transaction', async () => {
    const result = Transaction.verifyTransaction(mockedTransactionOne)

    expect(result).toBe(true)
  })
})
