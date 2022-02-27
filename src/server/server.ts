import * as express from "express"
import * as cors from "cors"
import { Blockchain } from "../blockchain/blockchain"
import { P2pServer } from "./p2p-server"
import { Wallet } from "../wallet/wallet"
import { TransactionPool } from "../wallet/transaction-pool"
import { logger } from "../lib/logger/logger"
import { endpoints } from "../api/endpoints"
import { HTTP_PORT } from "../config"

export const blockchain = new Blockchain()
export const wallet = new Wallet(Date.now().toString())
export const transactionPool = new TransactionPool()
export const p2pserver = new P2pServer(blockchain, transactionPool, wallet)

export const server = () => {
  logger.info(`Setting up server on port: ${HTTP_PORT}`)
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())

  logger.info(`Port ${HTTP_PORT}- ` + `Wallet Key: ${wallet.publicKey}`)
  p2pserver.listen()

  endpoints(app)
}
