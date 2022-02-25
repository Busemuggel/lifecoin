export const FIRST_LEADER = "the initial leader"
export const TRANSACTION_THRESHOLD = 3
export const TRANSACTION_FEE = 1
export const INITAL_BALANCE = 10000

export enum TRANSACTION_TYPE {
  Stake = "STAKE",
  Transaction = "TRANSACTION",
  Validator_fee = "VALIDATOR_FEE",
}

export type Balance = { [key: string]: number }

export type TransactionInput = {
  timestamp: number
  from: string
  signature: string
}

export type TransactionOutput = {
  to: string
  amount: number
  fee: number
}