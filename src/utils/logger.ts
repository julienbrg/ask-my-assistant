import fs from 'fs'
import path from 'path'

interface LogData {
  timestamp: string
  level: 'info' | 'error' | 'warn'
  message: string
  metadata?: any
}

class Logger {
  private logDir: string
  private logFile: string
  private errorFile: string

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs')
    this.logFile = path.join(this.logDir, 'app.log')
    this.errorFile = path.join(this.logDir, 'error.log')
    this.initializeLogDir()
  }

  private initializeLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true })
    }
  }

  private formatLog(data: LogData): string {
    return `[${data.timestamp}] [${data.level.toUpperCase()}] ${data.message} ${
      data.metadata ? `| ${JSON.stringify(data.metadata)}` : ''
    }\n`
  }

  private async writeToFile(filePath: string, logEntry: string) {
    try {
      await fs.promises.appendFile(filePath, logEntry)
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  private createLogData(level: LogData['level'], message: string, metadata?: any): LogData {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    }
  }

  async info(message: string, metadata?: any) {
    const logData = this.createLogData('info', message, metadata)
    const logEntry = this.formatLog(logData)
    console.log(logEntry.trim())
    await this.writeToFile(this.logFile, logEntry)
  }

  async error(message: string, metadata?: any) {
    const logData = this.createLogData('error', message, metadata)
    const logEntry = this.formatLog(logData)
    console.error(logEntry.trim())
    await this.writeToFile(this.errorFile, logEntry)
    await this.writeToFile(this.logFile, logEntry)
  }

  async warn(message: string, metadata?: any) {
    const logData = this.createLogData('warn', message, metadata)
    const logEntry = this.formatLog(logData)
    console.warn(logEntry.trim())
    await this.writeToFile(this.logFile, logEntry)
  }
}

export const logger = new Logger()
