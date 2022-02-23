import * as express from "express"
import * as cors from "cors"
import * as winston from 'winston'

import { Blockchain } from "../blockchain/blockchain"
import { P2pServer } from "./p2p-server"
import { Wallet } from "../wallet/wallet"
import { TransactionPool } from "../wallet/transaction-pool"

export const server = async () => {
  const logLevels = {
    levels: {
      critical: 0,
      error: 1,
      warn: 2,
      info: 3,
      debug: 4
    },
    colors: {
      critical: 'white redBG',
      error: 'red',
      warn: 'yellow',
      info: 'green',
      debug: 'magenta'
    }
  }

  winston.addColors(logLevels.colors)

  const logger = winston.createLogger({
    level: 'info',
    levels: logLevels.levels,
    format: winston.format.json(),
    defaultMeta: { service: 'lifecoin-service' },
    transports: [
      // - Write all logs with importance level of `critical` or less to `critical.log`
      // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // - Write all logs with importance level of `info` or less to `combined.log`
      // new winston.transports.File({ filename: 'combined.log' }),
    ],
  })

  if (process.env.NODE_ENV !== 'production') {
    logger.configure({level: 'debug'})

    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }))

    logger.add(
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    )
  }

  logger.log({
    level: 'debug',
    message: 'Debug says hello distributed log files!'
  })
  logger.log({
    level: 'info',
    message: 'Info says hello distributed log files!'
  })
  logger.log({
    level: 'warn',
    message: 'Warn says hello distributed log files!'
  })
  logger.log({
    level: 'error',
    message: 'Error says hello distributed log files!'
  })
  logger.log({
    level: 'critical',
    message: 'Critical says hello distributed log files!'
  })

  console.log("Setting up server...")
  
  const HTTP_PORT = process.env.HTTP_PORT // || 3001
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())
  
  const blockchain = new Blockchain()
  const wallet = new Wallet(Date.now().toString())

  console.log("Wallet Key: ", wallet.publicKey)

  // create a new transaction pool which will be later
  // decentralized and synchronized using the peer to peer server
  const transactionPool = new TransactionPool()
  const p2pserver = new P2pServer(blockchain, transactionPool, wallet)

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
      console.log(`listening on port ${HTTP_PORT}`)
    } catch (error) {
      console.log("Something went wrong")
    }
  })

  p2pserver.listen()
}