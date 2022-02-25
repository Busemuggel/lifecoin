import { SHA256 } from "crypto-js"
import { ChainUtil } from "../chain-util"
import { Transaction } from "../wallet/transaction"
import { Wallet } from "../wallet/wallet"

export class Block {
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

  toString(): string {
    return `Block - 
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash}
      Hash      : ${this.hash}
      Data      : ${this.data}
      Validator : ${this.validator}
      Signature : ${this.signature}`
  }

  static genesis(): Block {
    return new this(0, "----", "genesis-hash", [], "genesis-validator", "genesis-signature")
  }
  
  static createBlock(lastBlock: Block, data: Transaction[], wallet: Wallet): Block {

    console.log("createBlock IN BLOCK: ", data)

    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)
    const validator = wallet.getPublicKey()
    const signature = this.signBlockHash(hash, wallet)

    return new this(timestamp, lastHash, hash, data, validator, signature)
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