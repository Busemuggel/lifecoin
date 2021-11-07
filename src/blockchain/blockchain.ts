import { Account } from "./account"
import { Block } from "./block"
import { Stake } from "./stake"
import { Validators } from "./validator"

export class Blockchain {
  chain = [Block.genesis()]
  accounts: Account
  stakes: Stake
  validators: Validators

  constructor() {
    this.chain
  }

  public addBlock(data){
    const block = Block.createBlock(this.chain[this.chain.length-1],data)
    this.chain.push(block)
    
    return block
  }

  isValidChain(chain) {
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false

      for(let i = 1; i < chain.length; i++){
        const block = chain[i]
        const lastBlock = chain[i-1]
        if((block.lastHash !== lastBlock.hash) || (
          block.hash !== Block.blockHash(block)))
        return false
    }

    return true
  }
  
  replaceChain(newChain){
    if(newChain.length <= this.chain.length){
      console.log("Recieved chain is not longer than the current chain")
      return
    }else if(!this.isValidChain(newChain)){
      console.log("Recieved chain is invalid")
      return
    }
    
    console.log("Replacing the current chain with new chain")
    this.chain = newChain
  }

  getBalance(publicKey) {
    return this.accounts.getBalance(publicKey)
  }

  getLeader() {
    return this.stakes.getMax(this.validators.list);
  }
}