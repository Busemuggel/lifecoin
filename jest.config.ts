import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  roots: ["./tests"],
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  verbose: true,
  testMatch: ["**/tests/**/*spec.ts"]
}

export default config
