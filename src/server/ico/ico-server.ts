import * as express from "express"
import * as cors from "cors"
import Wallet from "../../wallet/wallet"
import Blockchain from "../../blockchain/blockchain"
import TransactionPool from "../../wallet/transaction-pool"
import P2pServer from "../p2p-server"
import { FIRST_LEADER, TRANSACTION_THRESHOLD } from "../../config"
import { logger } from "../../lib/logger/logger"
import * as mongoose from 'mongoose'

export const icoServer = async (): Promise<void> => {
  mongoose.connect(
    'mongodb+srv://Busemuggel:7IhSGLHm3ELht3ci@cluster0.2vg1b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {}, () => {
      logger.info(`Port ${HTTP_PORT}- ` + `connected to Database`)
    }
  )

  logger.info(`Setting up ICO-server on port ${process.env.HTTP_PORT}...`)

  const HTTP_PORT = 3000
  const app = express()

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())

  const blockchain = new Blockchain()
  const wallet = new Wallet(FIRST_LEADER)
  const transactionPool = new TransactionPool()
  const p2pserver = new P2pServer(blockchain, transactionPool, wallet)

  app.get("/ico/transactions", (req, res) => {
    res.json(transactionPool.transactions)
  })

  app.get("/ico/blocks", (req, res) => {
    res.json(blockchain.chain)
  })

  app.post("/ico/transact", (req, res) => {
    const { to, amount, type } = req.body
    const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)

    p2pserver.broadcastTransaction(transaction)
    if (transactionPool.transactions.length >= TRANSACTION_THRESHOLD) {
      const block = blockchain.createBlock(transactionPool.transactions, wallet)
      p2pserver.broadcastBlock(block)
    }
    res.redirect("/ico/transactions")
  })

  app.get("/ico/public-key", (req, res) => {
    res.json({ publicKey: wallet.publicKey })
  })

  app.get("/ico/balance", (req, res) => {
    res.json({ balance: blockchain.getBalance(wallet.publicKey) })
  })

  app.post("/ico/balance-of", (req, res) => {
    res.json({ balance: blockchain.getBalance(req.body.publicKey) })
  })

  app.listen(HTTP_PORT, () => {
    logger.info(`Listening on port ${HTTP_PORT}`)
  })

  p2pserver.listen()
}
