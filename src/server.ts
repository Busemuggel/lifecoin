import * as express from "express"
import * as cors from "cors"

import { blockchain } from "./blockchain/blockchain"

export const server = async () => {
  console.log("Setting up server...")
  
  const HTTP_PORT = process.env.HTTP_PORT || 3100
  const app = express()
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cors())

  //EXPOSED APIs

  //api to get the blocks
  app.get('/blocks',(req,res)=>{
    res.json(blockchain.chain)
  })

  //api to add blocks
  app.post('/mine',(req,res)=>{
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`)

    res.redirect('/blocks')
  });

  // app server configurations
  app.listen(HTTP_PORT,()=>{
    console.log(`listening on port ${HTTP_PORT}`)
  })

}