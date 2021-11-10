import { SHA256 } from "crypto-js"
import { ec } from "elliptic/lib/elliptic/ec"
import { v1 as uuidv1 } from "uuid"
const EDDSA = require("elliptic").eddsa
const eddsa = new EDDSA("ed25519")

var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

export class ChainUtil {
  static genKeyPair(secret) {
    return eddsa.keyFromSecret(secret)
  }

  static id(){
    return uuidv1()
  }

  static hash(data){
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash){
    return ec.keyFromPublic(publicKey).verify(dataHash, signature);
  }
  
}