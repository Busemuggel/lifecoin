import { SHA256 } from "crypto-js"
import { ChainUtil } from "../chain-util"
import { Wallet } from "../wallet/wallet"

export class Block {
  timestamp: any
  lastHash: any
  hash: any
  data
  validator?
  signature?

  constructor(timestamp: any, lastHash: any, hash: any, data: any, validator: any, signature: any) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.validator = validator
    this.signature = signature
  }

  toString() {
    return `Block - 
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash}
      Hash      : ${this.hash}
      Data      : ${this.data}
      Validator : ${this.validator}
      Signature : ${this.signature}`
  }

  static genesis() {
    return new this("genesis-time", "----", "genesis-hash", [], "genesis-validator", "genesis-signature")
  }
  
  static createBlock(lastBlock: any, data: any, wallet: Wallet): Block {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)
    
    const validator = wallet.getPublicKey()
    const signature = this.signBlockHash(hash, wallet)
    return new this(timestamp, lastHash, hash, data, validator, signature)
  }
  
  static hash(timestamp: any, lastHash: any, data: any) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString()
  }
  
  static blockHash(block: any) {
    const { timestamp, lastHash, data } = block
    return Block.hash(timestamp, lastHash, data)
  }
  
  static signBlockHash(hash: any, wallet: Wallet) {
    return wallet.sign(hash)
  }

  static verifyBlock(block: any) {
    return ChainUtil.verifySignature(
      block.validator,
      block.signature,
      Block.hash(block.timestamp, block.lastHash, block.data)
    )
  }

  static verifyLeader(block: any, leader: any) {
    return block.validator == leader ? true : false
  }

}