import 'jest'
import Account from '../../../src/blockchain/account'
// import Transaction, * as nativeTransaction from '../../../src/wallet/transaction'
// import * as nativeBlock from '../../../src/blockchain/block'
import { INITAL_BALANCE, TRANSACTION_FEE } from '../../../src/config'

/*
jest.mock('../../../src/wallet/transaction')
jest.mock('../../../src/blockchain/block')

const mockedTransaction = nativeTransaction as jest.Mocked<typeof nativeTransaction>
const Transaction = mockedTransaction.default

const mockedBlock = nativeBlock as jest.Mocked<typeof nativeBlock>
const Block = mockedBlock.default
*/

describe('Environment', () => {
  const account: Account = new Account()
  const TEST_ADDRESS = "5985a172e5718fee6de7a6a22302394423578449052b280be2e64f2b545163e3"
  const TEST_ADDRESS_BALANCE = 200

  const addressAndBalanceLoader = (): void => {
    account.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
      TEST_ADDRESS
    ]
    account.balance[Object.keys(account.balance)[0]] = INITAL_BALANCE - TEST_ADDRESS_BALANCE
    account.balance[TEST_ADDRESS] = TEST_ADDRESS_BALANCE
  }

  beforeEach(() => {
    account.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
    account.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": INITAL_BALANCE
    }
    // Transaction.mockClear()
    // Block.mockClear()
  })

  it('should add an adress to addresses', async () => {
    account.initialize(TEST_ADDRESS)

    expect(account.addresses).toStrictEqual(account.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
      "5985a172e5718fee6de7a6a22302394423578449052b280be2e64f2b545163e3"
    ])
  })

  it('should transfer an 150 from an adress to another adress', async () => {
    account.transfer(account.addresses[0], TEST_ADDRESS, 150)

    expect(account.addresses[1]).toStrictEqual(TEST_ADDRESS)
    expect(account.balance["502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"])
      .toBe(INITAL_BALANCE - 150)
    expect(account.balance[TEST_ADDRESS]).toBe(150)
  })

  it('should get the balance of the testAdress', async () => {
    addressAndBalanceLoader()

    const result = account.getBalance(TEST_ADDRESS)

    expect(result).toBe(TEST_ADDRESS_BALANCE)
  })

  it('should send the transfer fee from address 1 to address 2 with a transaction', async () => {
    addressAndBalanceLoader()
    const fromAdress = "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    // in future from type address
    const toValidator = "5985a172e5718fee6de7a6a22302394423578449052b280be2e64f2b545163e3"
    // in future from type validator

    account.transferFee(fromAdress, toValidator, TRANSACTION_FEE)

    expect(account.balance["502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"])
      .toBe(INITAL_BALANCE - TEST_ADDRESS_BALANCE - TRANSACTION_FEE)
    expect(account.balance[TEST_ADDRESS]).toBe(TEST_ADDRESS_BALANCE + TRANSACTION_FEE)
  })
})
