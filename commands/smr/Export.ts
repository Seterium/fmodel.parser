import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SmrExport extends BaseCommand {
  static commandName = 'smr:export'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SmrExport"')
  }
}
