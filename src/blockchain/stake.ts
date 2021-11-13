import { Blockchain } from "./blockchain"

export class Stake {
  addresses
  balance
  blockchain: Blockchain

  constructor() {
    this.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
    this.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": 0
    }
  }

  initialize(address) {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  addStake(from, amount) {
    this.initialize(from)
    this.balance[from] += amount
  }

  getBalance(address) {
    this.initialize(address)
    return this.balance[address]
  }

  getMax(addresses) {
    let balance = -1
    let leader = undefined
    addresses.forEach(address => {
      if (this.getBalance(address) > balance) {
        leader = address
      }
    })
    return leader
  }

  update(transaction) {
    let amount = transaction.output.amount
    let from = transaction.input.from
    this.addStake(from, amount)
  }
}