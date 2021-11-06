import * as express from "express"
import * as cors from "cors"

import { blockchain } from "./blockchain/blockchain"
import { P2pServer } from "./bin/p2p-server"

export const server = async () => {
  console.log("Setting up server...")
  
  const HTTP_PORT = process.env.HTTP_PORT || 3101
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())

  const p2pserver = new P2pServer(blockchain)
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

}