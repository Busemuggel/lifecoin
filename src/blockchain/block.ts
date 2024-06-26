import { SHA256 } from "crypto-js"
import ChainUtil from "../chain-util"
import Transaction from "../wallet/transaction"
import Wallet from "../wallet/wallet"

export default class Block {
  timestamp: number
  lastHash: string
  hash: string
  data: Transaction[]
  validator?: string
  signature?: string

  constructor(
    timestamp: number, 
    lastHash: string, 
    hash: string, 
    data: Transaction[], 
    validator: string, 
    signature: string
  ) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.validator = validator
    this.signature = signature
  }

  static genesis(): Block {
    return new Block(0, "----", "genesis-hash", [], "genesis-validator", "genesis-signature")
  }

  static createBlock(lastBlock: Block, data: Transaction[], wallet: Wallet): Block {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)
    const validator = wallet.getPublicKey()
    const signature = Block.signBlockHash(hash, wallet)

    return new Block(timestamp, lastHash, hash, data, validator, signature)
  }

  static hash(timestamp: number, lastHash: string, data: Transaction[]): string {
    return SHA256(`${timestamp}${lastHash}${data}`).toString()
  }

  static blockHash(block: Block): string {
    const { timestamp, lastHash, data } = block
    return Block.hash(timestamp, lastHash, data)
  }

  static signBlockHash(hash: string, wallet: Wallet): string {
    return wallet.sign(hash)
  }

  static verifyBlock(block: Block): boolean {
    return ChainUtil.verifySignature(
      block.validator,
      block.signature,
      Block.hash(block.timestamp, block.lastHash, block.data)
    )
  }

  static verifyLeader(block: Block, leader: string): boolean {
    return block.validator == leader ? true : false
  }
}
