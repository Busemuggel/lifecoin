enum Environments {
  PRODUCTION = 'production',
  DEV = 'dev',
  TEST = 'test',
  QA = 'qa',
  STAGING = 'staging',
}

enum EnvironmentFile {
  PRODUCTION = '.env.prod',
  DEV = '.env',
  TEST = '.env.test',
  QA = '.env.stag',
  STAGING = '.env.stag',
}

export {
  Environments,
  EnvironmentFile,
}
