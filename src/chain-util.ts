import { SHA256 } from "crypto-js"
import { v1 as uuidv1 } from "uuid"
const EDDSA = require("elliptic").eddsa
const eddsa = new EDDSA("ed25519")

export class ChainUtil {
  static genKeyPair(secret) {
    return eddsa.keyFromSecret(secret)
  }

  static id(){
    return uuidv1()
  }

  static hash(data){
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey, signature, dataHash) {
    return eddsa.keyFromPublic(publicKey).verify(dataHash, signature)
  }
  
}