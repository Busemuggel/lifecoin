import { SHA256 } from "crypto-js"

export class Block {
  timestamp
  lastHash
  hash
  data
  validator?
  signature?

  constructor(timestamp, lastHash, hash, data, validator, signature) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.validator = validator;
    this.signature = signature;
  }

  toString() {
    return `Block - 
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash}
      Hash      : ${this.hash}
      Data      : ${this.data}
      Validator : ${this.validator}
      Signature : ${this.signature}`;
  }

  static genesis() {
    return new this(`genesis time`, "----", "genesis-hash", [], "genesis-validator", "genesis-signature");
  }

  static createBlock(lastBlock, data, wallet) {
    let hash
    let timestamp = Date.now()
    const lastHash = lastBlock.hash
    hash = Block.hash(timestamp, lastHash, data)
    
    // get the validators public key
    let validator = wallet.getPublicKey()
    
    // Sign the block
    let signature = this.signBlockHash(hash, wallet)
    return new this(timestamp, lastHash, hash, data, validator, signature)
  }

  /* WILL BE REWORKED SOON */
  static signBlockHash(hash: any, wallet: any) {
    throw new Error("Method not implemented.")
  }

  static hash(timestamp, lastHash, data){
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  static blockHash(block){
    //destructuring
    const { timestamp, lastHash, data } = block;
    return Block.hash(timestamp, lastHash, data);
  }

}