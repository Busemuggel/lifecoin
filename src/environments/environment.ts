import * as fs from 'fs'
import { config as configDotenv } from 'dotenv'
import * as path from 'path'
import { EnvironmentFile, Environments } from './environment.constant'
import IEnvironment from './environment.interface'

class Environment implements IEnvironment {
  public httpPort: number
  public p2pPort: number
  public env: (Environments | string)
  // public secretKey: string
  // public applyEncryption: boolean

  constructor(NODE_ENV: Environments) {
    this.env = NODE_ENV
    const httpPort: string | undefined | number = process.env.HTTP_PORT || 3005
    const p2pPort: string | undefined | number = process.env.P2P_PORT || 5005
    this.setEnvironment(NODE_ENV)
    this.httpPort = Number(httpPort)
    this.p2pPort = Number(p2pPort)
    // this.applyEncryption = JSON.parse(process.env.APPLY_ENCRYPTION)
    // this.secretKey =  process.env.SECRET_KEY
  }

  public getCurrentEnvironment(): Environments {
    const environment: string = this.env

    switch (environment) {
      case Environments.PRODUCTION:
        return Environments.PRODUCTION
      case Environments.TEST:
        return Environments.TEST
      case Environments.STAGING:
        return Environments.STAGING
      case Environments.DEV:
      default:
        return Environments.DEV
    }
  }

  public setEnvironment(env: Environments): void {
    let envPath: string
    const rootdir : string = path.resolve(__dirname, '../../')
    this.env = env

    switch (env) {
      case Environments.PRODUCTION:
        envPath = path.resolve(rootdir, EnvironmentFile.PRODUCTION)
        break
      case Environments.DEV:
        envPath = path.resolve(rootdir, EnvironmentFile.DEV)
        break
      case Environments.TEST:
        envPath = path.resolve(rootdir, EnvironmentFile.TEST)
        break
      case Environments.STAGING:
        envPath = path.resolve(rootdir, EnvironmentFile.STAGING)
        break
    }

    if (!fs.existsSync(envPath)) {
      throw new Error('.env file is missing in root directory')
    }

    configDotenv({ path: envPath })
  }

  public isDevEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.DEV
  }

  public isTestEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.TEST
  }

  public isStagingEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.STAGING
  }

  public isProductionEnvironment(): boolean {
    return this.getCurrentEnvironment() === Environments.PRODUCTION
  }
}

export default Environment
