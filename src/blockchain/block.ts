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
    console.log("LOG-INFO:1", lastBlock)
    console.log("LOG-INFO:2", data)
    console.log("LOG-INFO:3", wallet.balance)
    console.log("LOG-INFO:3.2", wallet.publicKey)
    let hash
    let timestamp = Date.now()
    const lastHash = lastBlock.hash
    hash = Block.hash(timestamp, lastHash, data)
    
    // get the validators public key
    let validator = wallet.getPublicKey()
    console.log("LOG-INFO:4: ", validator)
    
    // Sign the block
    let signature = this.signBlockHash(hash, wallet)
    console.log("LOG-INFO:5")
    return new this(timestamp, lastHash, hash, data, validator, signature)
  }

  /* WILL BE REWORKED SOON */
  static signBlockHash(hash: any, wallet: any) {
    console.log("LOG-INF0 4.1: in signBlockhash")
    return
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