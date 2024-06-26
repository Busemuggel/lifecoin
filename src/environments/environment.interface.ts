interface IEnvironment {
  httpPort: number
  p2pPort: number
  // secretKey: string
  // applyEncryption: boolean
  getCurrentEnvironment(): string
  setEnvironment(env: string): void
  isProductionEnvironment(): boolean
  isDevEnvironment(): boolean
  isTestEnvironment(): boolean
  isStagingEnvironment(): boolean
}

export default IEnvironment
