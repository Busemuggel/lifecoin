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

  initialize(address: any): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  addStake(from: any, amount: any): void {
    this.initialize(from)
    this.balance[from] += amount
  }

  getBalance(address: any): any {
    this.initialize(address)
    return this.balance[address]
  }

  getMax(addresses: any): any {
    const balance = -1
    let leader = undefined
    addresses.forEach(address => {
      if (this.getBalance(address) > balance) {
        leader = address
      }
    })
    return leader
  }

  update(transaction: any): void {
    const amount = transaction.output.amount
    const from = transaction.input.from
    this.addStake(from, amount)
  }
}