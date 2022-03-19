import 'jest'
import { INITIAL_TEST_ADDRESS } from '../../mocks/mocked-address'
import Validators from '../../../src/blockchain/validator'
import { brokenMockedTransactionValidatorFee, mockedTransactionValidatorFee } from '../../mocks/mocked-transaction'

describe('Validator', () => {
  const validators: Validators = new Validators()

  beforeEach(() => {
    validators.list = [INITIAL_TEST_ADDRESS]
  })

  it('should add an adress to the validator list', async () => {
    const result1 = validators.update(mockedTransactionValidatorFee)
    const result2 = validators.update(brokenMockedTransactionValidatorFee)
    
    expect(validators.list).toStrictEqual([
      INITIAL_TEST_ADDRESS,
      "537d981836c881477816ded2179bd9da1985e0fe27909f068d7baec3e45a838e"
    ])
    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })
})
