import { WebSocket, WebSocketServer } from 'ws'
import { Blockchain } from '../blockchain/blockchain'
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

  listen() {
    const server = new WebSocketServer({ port: parseInt(`${P2P_PORT}`) })
    server.on('connection', socket => { this.connectSocket(socket) })
    this.connectToPeers()
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`)
  }
  
  connectSocket(socket: WebSocket) {
    this.sockets.push(socket)
    console.log("Socket connected")
    this.messageHandler(socket)
    this.sendChain(socket)
  }

  connectToPeers() {
    PEERS.forEach((peer) => {
      const socket = new WebSocket(peer)
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket: WebSocket) {
    socket.on('message', message => {
      const data = JSON.parse(message.toString())

      switch (data.type) {
        case MESSAGE_TYPE.chain: {
          this.blockchain.replaceChain(data.chain)
          break
        }

        case MESSAGE_TYPE.transaction: {
          let thresholdReached = null
          if (!this.transactionPool.transactionExists(data.transaction)) {
            thresholdReached = this.transactionPool.addTransaction(data.transaction) // without var?
            this.broadcastTransaction(data.transaction)
          }
          if (this.transactionPool.thresholdReached()) {
            if (this.blockchain.getLeader() == this.wallet.getPublicKey()) {
              console.log("Creating Block...")
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

  closeConnectionHandler(socket) {
    socket.on("close", () => (socket.isAlive = false))
  }

  sendChain(socket: WebSocket) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.chain,
        chain: this.blockchain.chain 
      })
    )
  }

  syncChain() {
    this.sockets.forEach(socket => {
      this.sendChain(socket)
    })
  }

  broadcastTransaction(transaction) {
    if (transaction !== undefined) {
      this.sockets.forEach(socket => {
        this.sendTransaction(socket,transaction)
      })
    }
  }

  sendTransaction(socket, transaction) {
    socket.send(JSON.stringify({
      type: MESSAGE_TYPE.transaction,
      transaction: transaction
    }))
  }

  broadcastBlock(block) {
    this.sockets.forEach(socket => {
      this.sendBlock(socket, block)
    })
  }

  sendBlock(socket, block) {
    socket.send(
      JSON.stringify({
        type: MESSAGE_TYPE.block,
        block: block
      })
    )
  }
}