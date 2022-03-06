import Transaction from "../wallet/transaction"

export default class Validators {
  list: string[]
  
  constructor() {
    this.list = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
  }

  update(transaction: Transaction): boolean {
    if (transaction.output.amount >= 25 && transaction.output.to == "0") {
      this.list.push(transaction.input.from)
      return true
    }
    return false
  }
}