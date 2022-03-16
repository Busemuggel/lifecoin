import ChainUtil from "../chain-util"
import { HTTP_PORT, TransactionInput, TransactionOutput, TRANSACTION_FEE, TRANSACTION_TYPE } from "../config"
import { logger } from "../lib/logger/logger"
import Wallet from "./wallet"

export default class Transaction {
  id: string
  type: TRANSACTION_TYPE
  input: TransactionInput
  output: TransactionOutput

  constructor() {
    this.id = ChainUtil.id()
    this.type = null
    this.input = null
    this.output = null
  }

  static newTransaction(
    senderWallet: Wallet, 
    to: string, 
    amount: number, 
    type: TRANSACTION_TYPE
  ): Transaction | undefined {
    logger.info(`Port ${HTTP_PORT}- ` + `Senderwallet: ${senderWallet.publicKey}`)
    if (amount + TRANSACTION_FEE > senderWallet.balance) {
      logger.info(`Port ${HTTP_PORT}- ` + 'Not enough balance')
      return
    }

    return Transaction.generateTransaction(senderWallet, to, amount, type)
  }

  static generateTransaction(
    senderWallet: Wallet, 
    to: string, 
    amount: number, 
    type: TRANSACTION_TYPE
  ): Transaction {
    const transaction = new this()
    transaction.type = type
    transaction.output = {
      to: to,
      amount: amount - TRANSACTION_FEE,
      fee: TRANSACTION_FEE
    }
    Transaction.signTransaction(transaction, senderWallet)
    return transaction
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet): void {
    transaction.input = {
      timestamp: Date.now(),
      from: senderWallet.publicKey,
      signature: senderWallet.sign(ChainUtil.hash(transaction.output))
    }
  }

  /* unused method */
  static verifyTransaction(transaction: Transaction): boolean {
    return ChainUtil.verifySignature(
      transaction.input.from,
      transaction.input.signature,
      ChainUtil.hash(transaction.output)
    )
  }
}
