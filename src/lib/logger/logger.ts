import * as winston from 'winston'

const logLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4
  },
  colors: {
    critical: 'white redBG',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'magenta'
  }
}

winston.addColors(logLevels.colors)

export const logger = winston.createLogger({
  level: 'info',
  levels: logLevels.levels,
  format: winston.format.json(),
  defaultMeta: { service: 'lifecoin-service' },
  transports: [
    // - Write all logs with importance level of `critical` or less to `critical.log`
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // - Write all logs with importance level of `info` or less to `combined.log`
    // new winston.transports.File({ filename: 'combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.configure({level: 'debug'})
  logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }))
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  )
}