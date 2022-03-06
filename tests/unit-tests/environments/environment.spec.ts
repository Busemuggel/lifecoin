import 'jest'
import Environment from '../../../src/environments/environment'
import { Environments } from '../../../src/environments/environment.constant'

describe('Environment', () => {
  let instance: Environment

  beforeEach(() => {
    instance = new Environment(Environments.TEST)
  })

  it('should get the current environment', async () => {
    const environment = instance.getCurrentEnvironment()

    expect(instance).toBeInstanceOf(Environment)
    expect(environment).toBeDefined()
    expect(environment).toBe(Environments.TEST)
  })

  it('should check if environement is dev or not', async () => {
    const result = instance.isDevEnvironment()
    expect(result).toBe(false)
  })

  it('should check if environement is test or not', async () => {
    const result = instance.isTestEnvironment()
    expect(result).toBe(true)
  })

  it('should check if environement is stage or not', async () => {
    const result = instance.isStagingEnvironment()
    expect(result).toBe(false)
  })

  it('should check if environement is production or not', async () => {
    const result = instance.isProductionEnvironment()
    expect(result).toBe(false)
  })

  it('should set the current environment to dev', async () => {
    instance.setEnvironment(Environments.DEV)
    const environment = instance.getCurrentEnvironment()
    expect(environment).toBeDefined()
    expect(environment).toBe(Environments.DEV)
    expect(environment).not.toBe(Environments.TEST)
  })

  it('should check if environment is not staging', async () => {
    instance.setEnvironment(Environments.STAGING)

    expect(instance.getCurrentEnvironment()).toBe(Environments.STAGING)
  })

  it('should check if environment is not production', async () => {
    instance.setEnvironment(Environments.PRODUCTION)

    expect(instance.getCurrentEnvironment()).toBe(Environments.PRODUCTION)
  })
})
