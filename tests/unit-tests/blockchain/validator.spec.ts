import 'jest'
import Validators from '../../../src/blockchain/validator'
import { brokenMockedTransactionValidatorFee, mockedTransactionValidatorFee } from './mocked-transaction'

describe('Validator', () => {
  const validators: Validators = new Validators()

  beforeEach(() => {
    validators.list = ["502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf"]
  })

  it('should add an adress to the validator list', async () => {
    const result1 = validators.update(mockedTransactionValidatorFee)
    const result2 = validators.update(brokenMockedTransactionValidatorFee)
    
    expect(validators.list).toStrictEqual([
      "502b5acaba0456d13955ca7b3da57455218ef2126282a631a885d7c5f77cbeaf",
      "537d981836c881477816ded2179bd9da1985e0fe27909f068d7baec3e45a838e"
    ])
    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})
