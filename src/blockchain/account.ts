export class Account {
  addresses
  balance

  constructor() {
    this.addresses = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
    this.balance = {
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf": 1000
    }
  }

  initialize(address) {
    if (this.balance[address] == undefined) {
      this.balance[address] = 0
      this.addresses.push(address)
    }
  }

  transfer(from, to, amount) {
    this.initialize(from)
    this.initialize(to)
    this.increment(to, amount)
    this.decrement(from, amount)
  }

  increment(to, amount) {
    this.balance[to] += amount
  }

  decrement(from, amount) {
    this.balance[from] -= amount
  }

  getBalance(address) {
    this.initialize(address)
    return this.balance[address]
  }

  update(transaction) {
    let amount = transaction.output.amount
    let from = transaction.input.from
    let to = transaction.output.to
    this.transfer(from, to, amount)
  }

  transferFee(block, transaction) {
    let amount = transaction.output.fee
    let from = transaction.input.from
    let to = block.validator
    this.transfer(from, to, amount)
  }

}