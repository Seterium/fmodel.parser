import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class All extends BaseCommand {
  static commandName = 'fmp:all'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Hello world from "FmpAll"')
  }
}
