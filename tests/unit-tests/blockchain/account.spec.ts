import 'jest'
import Account from '../../../src/blockchain/account'
import { INITAL_BALANCE, TRANSACTION_FEE } from '../../../src/config'
import { INITIAL_TEST_ADDRESS, TEST_ADDRESS, TEST_ADDRESS_BALANCE } from '../../mocks/mocked-address'

describe('Account', () => {
  const account: Account = new Account()

  const addressAndBalanceLoader = (): void => {
    account.addresses = [
      INITIAL_TEST_ADDRESS,
      TEST_ADDRESS
    ]
    account.balance[Object.keys(account.balance)[0]] = INITAL_BALANCE - TEST_ADDRESS_BALANCE
    account.balance[TEST_ADDRESS] = TEST_ADDRESS_BALANCE
  }

  beforeEach(() => {
    jest.clearAllMocks()
    account.addresses = [
      INITIAL_TEST_ADDRESS
    ]
    account.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": INITAL_BALANCE
    }
  })

  it('should add an adress to account addresses', async () => {
    account.initialize(TEST_ADDRESS)

    expect(account.addresses).toStrictEqual(account.addresses = [
      INITIAL_TEST_ADDRESS,
      TEST_ADDRESS
    ])
  })

  it('should transfer an 150 from an adress to another adress', async () => {
    const spy1 = jest.spyOn(account, 'initialize')
    const spy2 = jest.spyOn(account, 'increment')
    const spy3 = jest.spyOn(account, 'decrement')
    account.transfer(account.addresses[0], TEST_ADDRESS, 150)

    const result = account.addresses.find(e => e === TEST_ADDRESS)
    const result2 = account.balance[INITIAL_TEST_ADDRESS]
    const result3 = account.balance[TEST_ADDRESS]

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(result).toStrictEqual(TEST_ADDRESS)
    expect(result2).toBe(INITAL_BALANCE - 150)
    expect(result3).toBe(150)
  })

  it('should get the balance of the testAdress', async () => {
    const spy1 = jest.spyOn(account, 'initialize')
    addressAndBalanceLoader()

    const result = account.getBalance(TEST_ADDRESS)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(result).toBe(TEST_ADDRESS_BALANCE)
  })

  it('should send the transfer fee from address 1 to address 2 with a transaction', async () => {
    const spy1 = jest.spyOn(account, 'transfer')
    addressAndBalanceLoader()
    const fromAdress = INITIAL_TEST_ADDRESS
    // in future from type address
    const toValidator = TEST_ADDRESS
    // in future from type validator

    account.transferFee(fromAdress, toValidator, TRANSACTION_FEE)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(account.balance[INITIAL_TEST_ADDRESS])
      .toBe(INITAL_BALANCE - TEST_ADDRESS_BALANCE - TRANSACTION_FEE)
    expect(account.balance[TEST_ADDRESS]).toBe(TEST_ADDRESS_BALANCE + TRANSACTION_FEE)
  })
})
