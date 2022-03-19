import 'jest'
import Stake from '../../../src/blockchain/stake'
import { INITIAL_TEST_ADDRESS, TEST_ADDRESS, TEST_ADDRESS_2 } from '../../mocks/mocked-address'

describe('Stake', () => {
  const stake: Stake = new Stake()

  beforeEach(() => {
    jest.clearAllMocks()
    stake.addresses = [INITIAL_TEST_ADDRESS]
    stake.balance = {"502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": 0}
  })

  it('should add an adress to stake addresses', async () => {
    stake.initialize(TEST_ADDRESS)

    expect(stake.addresses).toStrictEqual(stake.addresses = [
      INITIAL_TEST_ADDRESS,
      TEST_ADDRESS
    ])
  })

  it('should stake coins to an address', async () => {
    const spy1 = jest.spyOn(stake, 'initialize')
    stake.addStake(TEST_ADDRESS, 50)

    const result = stake.addresses.find(e => e === TEST_ADDRESS)

    expect(spy1).toBeCalledTimes(1)
    expect(result).toStrictEqual(TEST_ADDRESS)
    expect(stake.balance[TEST_ADDRESS])
      .toBe(50)
  })

  it('should get the balance of an address', async () => {
    const spy1 = jest.spyOn(stake, 'initialize')
    stake.addStake(TEST_ADDRESS, 40)
    
    const result = stake.getBalance(TEST_ADDRESS)

    expect(result).toBe(40)
    expect(spy1).toBeCalledTimes(2)
  })

  it('should get the address with the highest staked balance', async () => {
    const spy1 = jest.spyOn(stake, 'getBalance')
    const spy2 = jest.spyOn(stake, 'initialize')
    stake.addStake(TEST_ADDRESS, 40)
    stake.addStake(TEST_ADDRESS_2, 65)

    const result = stake.getMax(stake.addresses)

    expect(result).toBe(TEST_ADDRESS_2)
    /* getBalance and initialize are called +1 for each stake address */
    expect(spy1).toBeCalledTimes(3)
    expect(spy2).toBeCalledTimes(5)
  })
})
