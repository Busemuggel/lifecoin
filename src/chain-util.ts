import { SHA256 } from "crypto-js"
import { v1 as uuidv1 } from "uuid"
import { eddsa as eddsa } from 'elliptic'

const EDDSA = new eddsa('ed25519')

export class ChainUtil {
  static genKeyPair(secret: any): eddsa.KeyPair {
    return EDDSA.keyFromSecret(secret)
  }

  static id(): string {
    return uuidv1()
  }

  static hash(data: any): string {
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey: any, signature: any, dataHash: any): boolean {
    return EDDSA.keyFromPublic(publicKey).verify(dataHash, signature)
  }
  
}