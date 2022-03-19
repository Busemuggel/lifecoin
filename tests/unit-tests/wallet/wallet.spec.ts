import 'jest'
import { helpers } from '../../unit-tests/unit-helpers'
import { TEST_HASH } from '../../mocks/mocked-block'
import { INITIAL_TEST_ADDRESS, TEST_ADDRESS } from '../../mocks/mocked-address'
import { FIRST_LEADER, TRANSACTION_TYPE } from '../../../src/config'
import * as Wallet from '../../../src/wallet/wallet'
import Transaction from '../../../src/wallet/transaction'
import * as TransactionPool from '../../../src/wallet/transaction-pool'
import * as Blockchain from '../../../src/blockchain/blockchain'

const mockedWallet = Wallet as jest.Mocked<typeof Wallet>
const mockedTransactionPool = TransactionPool as jest.Mocked<typeof TransactionPool>
const mockedBlockchain = Blockchain as jest.Mocked<typeof Blockchain>

describe('Wallet', () => {
  const wallet = new mockedWallet.default(FIRST_LEADER)
  const transactionPool = new mockedTransactionPool.default()
  const blockchain = new mockedBlockchain.default()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a string', async () => {
    const result = wallet.toString()

    expect.stringContaining(result)
  })

  it('should sign the datahash signature and return a string', async () => {
    const result = wallet.sign(TEST_HASH)

    expect.stringContaining(result)
  })

  it('should create a transaction', async () => {
    const spy1 = jest.spyOn(wallet, 'getBalance')
    const spy2 = jest.spyOn(Transaction, 'newTransaction')
    const spy3 = jest.spyOn(transactionPool, 'addTransaction')
    helpers.transactionLoader(transactionPool)

    const result = wallet.createTransaction(
      TEST_ADDRESS, 
      200, 
      TRANSACTION_TYPE.Transaction,
      blockchain,
      transactionPool
    )

    expect(result).toBeInstanceOf(Transaction)
    expect(result.output).toStrictEqual({
      to: TEST_ADDRESS,
      amount: 199,
      fee: 1
    })
    expect(result.type).toBe(TRANSACTION_TYPE.Transaction)
    expect(spy1).toBeCalledWith(blockchain)
    expect(spy2).toBeCalledTimes(1)
    expect(spy3).toBeCalledTimes(1)
  })

  it('should get the balance of the wallet', async () => {
    const spy1 = jest.spyOn(blockchain, 'getBalance')

    const result = wallet.getBalance(blockchain)

    expect(spy1).toBeCalledWith(wallet.publicKey)
    expect(result).toBe(10000)
  })

  it('should get the publicKey of the wallet', async () => {
    const result = wallet.getPublicKey()

    expect(result).toBe(INITIAL_TEST_ADDRESS)
  })


})
