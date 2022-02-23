type Balance = { [key: string]: number }

export class Account {
  addresses: Array<string>
  balance: Balance

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
    const amount = transaction.output.amount
    const from = transaction.input.from
    const to = transaction.output.to
    this.transfer(from, to, amount)
  }

  transferFee(block, transaction) {
    const amount = transaction.output.fee
    const from = transaction.input.from
    const to = block.validator
    this.transfer(from, to, amount)
  }

}