import { WebSocket, WebSocketServer } from 'ws'
import { Block } from '../blockchain/block'
import { Blockchain } from '../blockchain/blockchain'
import { logger } from '../lib/logger/logger'
import { Transaction } from '../wallet/transaction'
import { TransactionPool } from '../wallet/transaction-pool'
import { Wallet } from '../wallet/wallet'

const P2P_PORT = process.env.P2P_PORT // || 5000
const PEERS = process.env.PEERS ? process.env.PEERS.split(',') : []

const MESSAGE_TYPE = {
  block: "BLOCK",
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: "CLEAR_TRANSACTIONS"
}

export class P2pServer {
  blockchain: Blockchain
  sockets: WebSocket[]
  transactionPool: TransactionPool
  wallet: Wallet

  constructor(blockchain: Blockchain, transactionPool: TransactionPool, wallet: Wallet) {
    this.blockchain = blockchain
    this.sockets = []
    this.transactionPool = transactionPool
    this.wallet = wallet
  }

  listen(): void {
    const server = new WebSocketServer({ port: parseInt(`${P2P_PORT}`) })
    server.on('connection', socket => { this.connectSocket(socket) })
    this.connectToPeers()
    logger.info(`Listening for peer to peer connection on P2P-Port : ${P2P_PORT}`)
  }
  
  connectSocket(socket: WebSocket): void {
    this.sockets.push(socket)
    logger.info(`P2P-Port ${P2P_PORT}- ` + 'Socket connected')
    this.messageHandler(socket)
    this.sendChain(socket)
  }

  connectToPeers(): void {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket: WebSocket): void {
    socket.on('message', message => {
      const data = JSON.parse(message.toString())

      switch (data.type) {
        case MESSAGE_TYPE.chain: {
          this.blockchain.replaceChain(data.chain)
          break
        }

        case MESSAGE_TYPE.transaction: {
          if (!this.transactionPool.transactionExists(data.transaction)) {
            this.transactionPool.addTransaction(data.transaction)
            this.broadcastTransaction(data.transaction)
          }
          if (this.transactionPool.thresholdReached()) {
            if (this.blockchain.getLeader() == this.wallet.getPublicKey()) {
              const block = this.blockchain.createBlock(
                this.transactionPool.transactions,
                this.wallet
              )
              this.broadcastBlock(block)
            }
          }
          break
        }

        case MESSAGE_TYPE.block: {
          if (this.blockchain.isValidBlock(data.block)) {
            this.broadcastBlock(data.block)
            this.transactionPool.clear()
          }
          break
        }
      }
    })
  }

  /*
  closeConnectionHandler(socket: any): void {
    socket.on("close", () => (socket.isAlive = false))
  }
  */

  sendChain(socket: WebSocket): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain 
      })
    )
  }

  syncChain(): void {
    this.sockets.forEach(socket => {
      this.sendChain(socket)
    })
  }

  broadcastTransaction(transaction: Transaction): void {
    if (transaction !== undefined) {
      this.sockets.forEach(socket => {
        this.sendTransaction(socket,transaction)
      })
    }
  }

  sendTransaction(socket: WebSocket, transaction: Transaction): void {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPE.transaction,
      transaction: transaction
    }))
  }

  broadcastBlock(block: Block): void {
    this.sockets.forEach(socket => {
      this.sendBlock(socket, block)
    })
  }

  sendBlock(socket: WebSocket, block: Block): void {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.block,
        block: block
      })
    )
    logger.info(`P2P-Port ${P2P_PORT}- ` + 'Broadcast Block')
  }
}