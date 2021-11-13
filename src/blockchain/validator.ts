export class Validators {
  list
  
  constructor() {
    this.list = [
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"
    ]
  }

  update(transaction) {
    console.log("LOG X update validators", transaction)
    if (transaction.output.amount >= 25 && transaction.output.to == "0") {
      this.list.push(transaction.input.from)
      console.log("New Validator:", transaction.input.from)
      console.log("MY UPDATED LIST: ", this.list)
      return true
    }
    return false
  }
}