import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class FMPMods extends BaseCommand {
  static commandName = 'fmp:mods'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "FmpMods"')
  }
}
