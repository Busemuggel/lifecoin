import { Balance } from "../config"

export default class Stake {
  addresses: Array<string>
  balance: Balance

  constructor() {
    this.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
    this.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": 0
    }
  }

  initialize(address: string): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  addStake(from: string, amount: number): void {
    this.initialize(from)
    this.balance[from] += amount
  }

  getBalance(address: string): number {
    this.initialize(address)
    return this.balance[address]
  }

  getMax(addresses: Array<string>): string {
    const balance = -1
    let leader: string = undefined
    addresses.forEach(address => {
      if (this.getBalance(address) > balance) {
        leader = address
      }
    })
    return leader
  }
}
