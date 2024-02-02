import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

export default class Export extends BaseCommand {
  static commandName = 'fmp:export'

  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    console.log('fmp:export')
  }
}
