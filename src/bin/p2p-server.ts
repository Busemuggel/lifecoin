import { WebSocket, WebSocketServer } from 'ws'

//declare the peer to peer server port 
const P2P_PORT = parseInt(process.env.P2P_PORT) || 3201

//list of address to connect to
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

export class P2pServer{
  blockchain: any
  sockets: string[]

  constructor(blockchain) {
    this.blockchain = blockchain
    this.sockets = []
  }

  // create a new p2p server and connections

  listen(){
    const server = new WebSocketServer({ port: P2P_PORT })

    /* event listener and a callback function for any new connection
      on any new connection the current instance will send the current chain
      to the newly connected peer 
    */
    server.on('connection', socket => this.connectSocket(socket))

    // to connect to the peers that we have specified
    this.connectToPeers()
    console.log(`Listening for peer to peer connection on port : ${P2P_PORT}`)
  }

  connectToPeers(){
    //connect to each peer
    peers.forEach(() => {
      // create a socket for each peer
      const socket = new WebSocket(`ws://localhost:${P2P_PORT}`)
      
      // open event listner is emitted when a connection is established
      // saving the socket in the array
      socket.on('open', () => this.connectSocket(socket))
    })
  }
    
  // after making connection to a socket
  connectSocket(socket){
    // push the socket too the socket array
    this.sockets.push(socket)
    console.log("Socket connected")    
  }
}