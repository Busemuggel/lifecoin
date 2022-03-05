enum Environments {
  PRODUCTION = 'production',
  DEV = 'dev',
  TEST = 'test',
  STAGING = 'staging',
}

enum EnvironmentFile {
  PRODUCTION = '.env.prod',
  DEV = '.env',
  TEST = '.env.test',
  STAGING = '.env.stag',
}

export {
  Environments,
  EnvironmentFile,
}
