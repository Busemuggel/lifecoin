import { SHA256 } from "crypto-js"
import { v1 as uuidv1 } from "uuid"
import { eddsa as eddsa } from 'elliptic'

const EDDSA = new eddsa('ed25519')

export class ChainUtil {
  static genKeyPair(secret) {
    return EDDSA.keyFromSecret(secret)
  }

  static id() {
    return uuidv1()
  }

  static hash(data) {
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey, signature, dataHash) {
    return EDDSA.keyFromPublic(publicKey).verify(dataHash, signature)
  }
  
}