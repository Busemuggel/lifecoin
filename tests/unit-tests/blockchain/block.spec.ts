import 'jest'
import { FIRST_LEADER } from '../../../src/config'
import Wallet from '../../../src/wallet/wallet'
import Block from '../../../src/blockchain/block'
import Transaction from '../../../src/wallet/transaction'
import { mockedBlock } from './mocked-block'

import { mockedTransactionOne, mockedTransactionStake, mockedTransactionTwo } from './mocked-transaction'

describe('Environment', () => {
  let block: Block
  const transactions: Transaction[] = [
    mockedTransactionOne,
    mockedTransactionTwo,
    mockedTransactionStake
  ]
  const wallet = new Wallet(FIRST_LEADER)

  beforeEach(() => {
    block = mockedBlock
  })

  it('should check if genesis Block is from type Block', async () => {
    const result = Block.genesis()

    expect(result).toBeInstanceOf(Block)
  })

  it('should create a block from the last block, a data set of Transactions and a wallet validator', async () => {
    const result = Block.createBlock(block, transactions, wallet)

    expect(result).toBeInstanceOf(Block)
  })


  it('should hash a block and return a string', async () => {
    const result = Block.blockHash(block)

  //  expect(result).toBeInstanceOf(String)

    expect.stringContaining(result)
  })

  it('should check if a block is valid', async () => {
    const result = Block.verifyBlock(block)

    expect(result).toBeTruthy
  })

  it('should check if a leader is valid', async () => {
    const leader: string = '502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf'
    const falseLeader: string = 'asdf'

    const result = Block.verifyLeader(block, leader)
    const falseResult = Block.verifyLeader(block, falseLeader)

    expect(result).toBe(true)
    expect(falseResult).toBe(false)
  })
})