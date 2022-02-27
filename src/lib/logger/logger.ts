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
  level: 'warn',
  levels: logLevels.levels,
  format: winston.format.json(),
  defaultMeta: { service: 'lifecoin-service' },
  transports: [
    // - Write all logs with importance level of `warn` or less to `error.log`
    new winston.transports.File({ filename: 'logs/error.log', level: 'warn' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ],
  exitOnError: false
})

/*
winston.exceptions.handle(
  new winston.transports.File({ filename: 'logs/winston-exceptions.log' })
)
*/

if (process.env.NODE_ENV !== 'production') {
  logger.configure({
    level: 'debug',
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'warn' })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
  })
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  )
}