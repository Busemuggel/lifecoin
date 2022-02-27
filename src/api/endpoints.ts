import { Express, Request, Response } from "express"
import { HTTP_PORT } from "../config"
import { logger } from "../lib/logger/logger"
import { Todo } from "../models/todo"
import { blockchain, p2pserver, transactionPool, wallet } from "../server/server"

export const endpoints = (app: Express): void => {
  app.get('/blocks', (_req,res) => {
    try {
      res.json(blockchain.chain)
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong")
    }
  })

  app.get("/transactions", (_req, res) => {
    try {
      res.json(transactionPool.transactions)
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong")
    }
  })
  
  app.post("/transact", (req, res) => {
    // case type.fee type.transaction type.stake
    try {
      const { to, amount, type } = req.body
      const transaction = wallet.createTransaction(to, amount, type, blockchain, transactionPool)
      p2pserver.broadcastTransaction(transaction)
      res.redirect("/transactions")
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong.")
    }
  })
  
  app.get("/bootstrap", (_req, res) => {
    try {
      // p2pserver.bootstrapSystem() -> this api doesnt work right now
      res.json({ message: "System bootstraped" })
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong")
    }
  })
  
  app.get("/public-key", (_req, res) => {
    try {
      res.json({ publicKey: wallet.publicKey })
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong")
    }
  })
  
  app.get("/balance", (_req, res) => {
    try {
      res.json({ balance: blockchain.getBalance(wallet.publicKey) })
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong")
    }
  })
  
  app.listen(HTTP_PORT, async () => {
    try {
      logger.info(`listening on port ${HTTP_PORT}`)
    } catch (error) {
      logger.error("Something went wrong")
    }
  })

  app.post("/todo", async (req: Request, res: Response) => {
    // case type.fee type.transaction type.stake
    try {
      const { title, description} = req.body
      const todo = Todo.build({ title, description})
      await todo.save()
      return res.status(201).send(todo)
      
    } catch (error) {
      logger.error(`Error on Port ${HTTP_PORT}-` + error, [new Date()])
      res.send("Something went wrong.")
    }
  })

  app.get('/todo', [], async (req: Request, res: Response) => {
    const todo = await Todo.find({})
    return res.status(200).send(todo)
  })



}