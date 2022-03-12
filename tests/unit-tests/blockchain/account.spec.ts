import 'jest'
import Account from '../../../src/blockchain/account'
import { INITAL_BALANCE, TRANSACTION_FEE } from '../../../src/config'
import { TEST_ADDRESS, TEST_ADDRESS_BALANCE } from './mocked-address'

describe('Account', () => {
  const account: Account = new Account()

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
  })

  it('should add an adress to account addresses', async () => {
    account.initialize(TEST_ADDRESS)

    expect(account.addresses).toStrictEqual(account.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
      "5985a172e5718fee6de7a6a22302394423578449052b280be2e64f2b545163e3"
    ])
  })

  it('should transfer an 150 from an adress to another adress', async () => {
    account.transfer(account.addresses[0], TEST_ADDRESS, 150)

    const result = account.addresses.find(e => e === TEST_ADDRESS)
    const result2 = account.balance["502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"]
    const result3 = account.balance[TEST_ADDRESS]

    expect(result).toStrictEqual(TEST_ADDRESS)
    expect(result2).toBe(INITAL_BALANCE - 150)
    expect(result3).toBe(150)
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
