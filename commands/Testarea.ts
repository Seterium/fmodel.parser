import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

export default class Testarea extends BaseCommand {
  static commandName = 'testarea'

  static description = 'Тестовая команда'

  static options: CommandOptions = {}

  async run() {
    console.log('testarea')
  }
}
