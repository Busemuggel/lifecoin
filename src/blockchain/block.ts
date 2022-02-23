import { SHA256 } from "crypto-js"
import { ChainUtil } from "../chain-util"
import { Wallet } from "../wallet/wallet"

export class Block {
  timestamp
  lastHash
  hash
  data
  validator?
  signature?

  constructor(timestamp, lastHash, hash, data, validator, signature) {
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
  
  static createBlock(lastBlock, data, wallet: Wallet): Block {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.hash(timestamp, lastHash, data)
    
    const validator = wallet.getPublicKey()
    const signature = this.signBlockHash(hash, wallet)
    return new this(timestamp, lastHash, hash, data, validator, signature)
  }
  
  static hash(timestamp, lastHash, data) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString()
  }
  
  static blockHash(block) {
    const { timestamp, lastHash, data } = block
    return Block.hash(timestamp, lastHash, data)
  }
  
  static signBlockHash(hash: any, wallet: Wallet) {
    return wallet.sign(hash)
  }

  static verifyBlock(block) {
    return ChainUtil.verifySignature(
      block.validator,
      block.signature,
      Block.hash(block.timestamp, block.lastHash, block.data)
    )
  }

  static verifyLeader(block, leader) {
    return block.validator == leader ? true : false
  }

}