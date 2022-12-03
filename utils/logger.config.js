import log4js from 'log4js'

log4js.configure({
    appenders: {
        console: {type: 'console'},
        warnLog: {type: 'file', filename: './logs/warn.log'},
        errorLog: {type: 'file', filename: './logs/error.log'},

        loggerConsole: {type: 'logLevelFilter', appender: 'console', level: 'info'},
        loggerWarnings: {type: 'logLevelFilter', appender: 'warnLog', level: 'warn'},
        loggerError: {type: 'logLevelFilter', appender: 'errorLog', level: 'error'}
    },
    categories: {
        default: {
            appenders: ['loggerConsole', 'loggerWarnings', 'loggerError'],
            level: 'all'
        }
    }
})

let logger = log4js.getLogger()

const NoImplementada = (req) => {
    logger.warn(`Ruta ${req.url} con metodo ${req.method} no implementada`)
}

const Ruta = (req) => {
    logger.info(`Ruta ${req.url} con metodo ${req.method} accedida`)
}

export {logger, Ruta, NoImplementada}