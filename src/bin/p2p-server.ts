import { WebSocket, WebSocketServer } from 'ws'
import { Blockchain } from '../blockchain/blockchain'

//declare the peer to peer server port 
const P2P_PORT = process.env.P2P_PORT || 5001

//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

export class P2pServer{
  blockchain: Blockchain
  sockets: WebSocket[]

  constructor(blockchain: Blockchain) {
    this.blockchain = blockchain
    this.sockets = []
  }

  // create a new p2p server and connections

  listen(){
    const P2P_PORT_1 = parseInt(`${P2P_PORT}`)
    const server = new WebSocketServer({ port: P2P_PORT_1 })

    /* event listener and a callback function for any new connection
      on any new connection the current instance will send the current chain
      to the newly connected peer 
    */
    server.on('connection', socket => this.connectSocket(socket))

    // to connect to the peers that we have specified
    this.connectToPeers()
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`)
  }
  
  connectSocket(socket: WebSocket){
    // push the socket too the socket array
    this.sockets.push(socket)
    console.log("Socket connected: ", socket.url)
    // register a message event listener to the socket
    this.messageHandler(socket)
    // on new connection send the blockchain chain to the peer
    this.sendChain(socket)
  }

  connectToPeers(){
    //connect to each peer
    peers.forEach((peer) => {
      // create a socket for each peer
      const socket = new WebSocket(peer)
      
      // open event listner is emitted when a connection is established
      // saving the socket in the array
      socket.on('open', () => this.connectSocket(socket))
    })
  }

  messageHandler(socket: WebSocket){
    //on recieving a message execute a callback function
    socket.on('message', message => {
      const data = JSON.parse(message.toString())
      console.log("data ", data)
      this.blockchain.replaceChain(data)
    })
  }

  /* helper function to send the chain instance */
  sendChain(socket: WebSocket){
    socket.send(JSON.stringify(this.blockchain.chain))
  }

  /* utility function to sync the chain whenever a new block is added to the blockchain */
  syncChain(){
    this.sockets.forEach(socket =>{
      this.sendChain(socket)
    })
  }
  
}