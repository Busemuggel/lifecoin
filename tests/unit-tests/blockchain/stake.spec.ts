import 'jest'
import Stake from '../../../src/blockchain/stake'
import { TEST_ADDRESS, TEST_ADDRESS_2 } from '../../mocks/mocked-address'

describe('Stake', () => {
  const stake: Stake = new Stake()

  beforeEach(() => {
    stake.addresses = ["502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"]
    stake.balance = {"502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": 0}
  })

  it('should add an adress to stake addresses', async () => {
    stake.initialize(TEST_ADDRESS)

    expect(stake.addresses).toStrictEqual(stake.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
      "5985a172e5718fee6de7a6a22302394423578449052b280be2e64f2b545163e3"
    ])
  })

  it('should stake coins to an address', async () => {
    stake.addStake(TEST_ADDRESS, 50)

    const result = stake.addresses.find(e => e === TEST_ADDRESS)

    expect(result).toStrictEqual(TEST_ADDRESS)
    expect(stake.balance[TEST_ADDRESS])
      .toBe(50)
  })

  it('should get the balance of an address', async () => {
    stake.addStake(TEST_ADDRESS, 40)
    
    const result = stake.getBalance(TEST_ADDRESS)

    expect(result).toBe(40)
  })

  it('should get the address with the highest staked balance', async () => {
    stake.addStake(TEST_ADDRESS, 40)
    stake.addStake(TEST_ADDRESS_2, 65)

    const result = stake.getMax(stake.addresses)

    expect(result).toBe(TEST_ADDRESS_2)
  })
})
