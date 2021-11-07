export class Validators {
  list
  
  constructor() {
    this.list = []
  }

  update(transaction) {
    if (transaction.amount == 30 && transaction.to == "0") {
      this.list.push(transaction.from);
      return true
    }
    return false
  }
}