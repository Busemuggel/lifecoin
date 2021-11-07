import * as express from "express"
import * as cors from "cors"

import { Blockchain } from "./blockchain/blockchain"
import { P2pServer } from "./bin/p2p-server"
import { Wallet } from "./wallet/wallet"
import { TransactionPool } from "./wallet/transaction-pool"

export const server = async () => {
  console.log("Setting up server...")
  
  const HTTP_PORT = process.env.HTTP_PORT || 3001
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())
  
  // create a new wallet
  const wallet = new Wallet(Date.now().toString());
  // Date.now() is used create a random string for secret
  // create a new transaction pool which will be later
  // decentralized and synchronized using the peer to peer server
  const transactionPool = new TransactionPool()

  // create a new blockchain instance
  const blockchain = new Blockchain()
  const p2pserver = new P2pServer(blockchain, transactionPool)
  p2pserver.listen()

  //EXPOSED APIs

  //api to get the blocks
  app.get('/blocks',(req,res)=>{
    try {
      res.json(blockchain.chain)
    } catch (error) {
      res.send("Something went wrong")
    }
  })

  //api to add blocks
  app.post('/mine',(req,res)=>{
    try {
      const block = blockchain.addBlock(req.body)
      console.log(`New block added: ${block.toString()}`)
      res.redirect('/blocks')
      p2pserver.syncChain()
    } catch (error) {
      res.send("Something went wrong")
    }
  })

  // app server configurations
  app.listen(HTTP_PORT,()=>{
    try {
      console.log(`listening on port ${HTTP_PORT}`)
    } catch (error) {
      console.log("Something went wrong")
    }
  })

  // api to view transaction in the transaction pool
  app.get('/transactions',(req,res) => {
    try {
      const result = transactionPool.transactions
      res.send(result)
    } catch (error) {
      console.log(error) 
    }
  })

  // create transactions
  app.post("/transact", (req, res) => {
    try {
      const { to, amount, type } = req.body
      // console.log("blockchain: ", blockchain)
      // console.log("transactionPool: ", transactionPool)
      // console.log("WALLET: ", wallet.balance)
      const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)
      // console.log("Transactions: ", transaction)
      p2pserver.broadcastTransaction(transaction);
      res.redirect("/transactions")
    } catch (error) {
      // res.send("Something went wrong.")
      res.send(error)
    }
  })
}