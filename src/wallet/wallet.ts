import { ChainUtil } from "../chain-util"

export class Wallet {
  balance
  keyPair
  publicKey

  constructor(balance, keyPair, publicKey, secret) {
    this.balance = 0;
    this.keyPair = ChainUtil.genKeyPair(secret);
    this.publicKey = this.keyPair.getPublic("hex");
  }

  toString() {
    return `Wallet - 
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}`;
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

}