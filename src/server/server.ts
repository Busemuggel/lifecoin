import * as express from "express"
import * as cors from "cors"

import { Blockchain } from "../blockchain/blockchain"
import { P2pServer } from "./p2p-server"
import { Wallet } from "../wallet/wallet"
import { TransactionPool } from "../wallet/transaction-pool"
import { logger } from "../lib/logger/logger"

export const server = async (): Promise<void> => {
  logger.info(`Setting up server on port: ${process.env.HTTP_PORT}`)
  
  const HTTP_PORT = process.env.HTTP_PORT
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())
  
  const blockchain = new Blockchain()
  const wallet = new Wallet(Date.now().toString())
  const transactionPool = new TransactionPool()
  const p2pserver = new P2pServer(blockchain, transactionPool, wallet)

  logger.info(`Port ${HTTP_PORT}- ` + `Wallet Key: ${wallet.publicKey}`)

  app.get('/blocks',(req,res)=>{
    try {
      res.json(blockchain.chain)
    } catch (error) {
      res.send("Something went wrong")
    }
  })

  app.get("/transactions", (req, res) => {
    res.json(transactionPool.transactions)
  })
  
  app.post("/transact", (req, res) => {
    // case type.fee type.transaction type.stake
    try {
      const { to, amount, type } = req.body
      const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)
      p2pserver.broadcastTransaction(transaction)
      res.redirect("/transactions")
    } catch (error) {
      res.send("Something went wrong.")
    }
  })
  
  app.get("/bootstrap", (req, res) => {
    // p2pserver.bootstrapSystem() -> this api doesnt work right now
    res.json({ message: "System bootstraped" })
  })
  
  app.get("/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey })
  })
  
  app.get("/balance", (req, res) => {
    res.json({ balance: blockchain.getBalance(wallet.publicKey) })
  })
  
  app.listen(HTTP_PORT, () => {
    try {
      logger.info(`listening on port ${HTTP_PORT}`)
    } catch (error) {
      logger.error("Something went wrong")
    }
  })

  p2pserver.listen()
}