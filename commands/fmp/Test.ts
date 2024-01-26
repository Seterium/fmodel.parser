import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

export default class Test extends BaseCommand {
  static commandName = 'fmp:test'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "Test"')
  }
}
