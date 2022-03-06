import { SHA256 } from "crypto-js"
import { v1 as uuidv1 } from "uuid"
import { eddsa as eddsa } from 'elliptic'
import { TransactionOutput } from "./config"

const EDDSA = new eddsa('ed25519')

export default class ChainUtil {
  static genKeyPair(secret: eddsa.Bytes): eddsa.KeyPair {
    return EDDSA.keyFromSecret(secret)
  }

  static id(): string {
    return uuidv1()
  }

  static hash(data: TransactionOutput): string {
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey: string, signature: string, dataHash: string): boolean {
    return EDDSA.keyFromPublic(publicKey).verify(dataHash, signature)
  }
  
}