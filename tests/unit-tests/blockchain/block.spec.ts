import 'jest'
import { FIRST_LEADER } from '../../../src/config'
import Block from '../../../src/blockchain/block'
import Transaction from '../../../src/wallet/transaction'
import { mockedBlock } from '../../mocks/mocked-block'
import { mockedTransactionOne, mockedTransactionStake, mockedTransactionTwo } from '../../mocks/mocked-transaction'
import * as nativeWallet from '../../../src/wallet/wallet'
import ChainUtil from '../../../src/chain-util'

const mockedWallet = nativeWallet as jest.Mocked<typeof nativeWallet>

describe('Block', () => {
  let block: Block
  const transactions: Transaction[] = [
    mockedTransactionOne,
    mockedTransactionTwo,
    mockedTransactionStake
  ]
  const wallet = new mockedWallet.default(FIRST_LEADER)

  beforeEach(() => {
    block = mockedBlock
    jest.clearAllMocks()
  })

  it('should check if genesis Block is from type Block', async () => {
    const result = Block.genesis()

    expect(result).toBeInstanceOf(Block)
  })

  it('should create a block from the last block, a data set of Transactions and a wallet validator', async () => {
    const spy1 = jest.spyOn(Block, 'hash')
    const spy2 = jest.spyOn(wallet, 'getPublicKey')
    const spy3 = jest.spyOn(Block, 'signBlockHash')

    const result = Block.createBlock(block, transactions, wallet)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(result).toBeInstanceOf(Block)
  })

  it('should hash a block and return a string', async () => {
    const result = Block.blockHash(block)

    expect.stringContaining(result)
  })

  it('should check if a block is valid', async () => {
    const spy1 = jest.spyOn(ChainUtil, 'verifySignature')
    const spy2 = jest.spyOn(Block, 'hash')

    const result = Block.verifyBlock(block)

    expect(result).toBeTruthy
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
  })

  it('should check if a leader is valid', async () => {
    const leader = '502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf'
    const falseLeader = 'asdf'

    const result = Block.verifyLeader(block, leader)
    const falseResult = Block.verifyLeader(block, falseLeader)

    expect(result).toBe(true)
    expect(falseResult).toBe(false)
  })
})
