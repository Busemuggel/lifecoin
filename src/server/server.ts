import * as express from "express"
import * as cors from "cors"

import { Blockchain } from "../blockchain/blockchain"
import { P2pServer } from "./p2p-server"
import { Wallet } from "../wallet/wallet"
import { TransactionPool } from "../wallet/transaction-pool"
import { TRANSACTION_THRESHOLD } from "../config"

export const server = async () => {
  console.log("Setting up server...")
  
  const HTTP_PORT = process.env.HTTP_PORT || 3001
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
      console.log("server.ts app post /ico/transact -> blockchain: ", blockchain.validators)
      const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)
      p2pserver.broadcastTransaction(transaction)
      
   //   if (transactionPool.transactions.length >= TRANSACTION_THRESHOLD) {
  //      let block = blockchain.createBlock(transactionPool.transactions, wallet)
  //      p2pserver.broadcastBlock(block)
  //    }

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