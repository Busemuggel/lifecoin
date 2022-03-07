import { Balance, INITAL_BALANCE } from "../config"

export default class Account {
  addresses: Array<string>
  balance: Balance

  constructor() {
    this.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
    this.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": INITAL_BALANCE
    }
  }

  initialize(address: string): void {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  transfer(from: string, to: string, amount: number): void {
    this.initialize(from)
    this.initialize(to)
    this.increment(to, amount)
    this.decrement(from, amount)
  }

  increment(to: string, amount: number): void {
    this.balance[to] += amount
  }

  decrement(from: string, amount: number): void {
    this.balance[from] -= amount
  }

  getBalance(address: string): number {
    this.initialize(address)
    return this.balance[address]
  }

  /* from should be a address type and to a validator type and amount from type fee */
  transferFee(fromAdress: string, toValidator: string, amount: number): void {
    this.transfer(fromAdress, toValidator, amount)
  }
}
