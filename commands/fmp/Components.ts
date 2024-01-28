import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'
import { ComponentsParser } from '#services'

export default class Components extends BaseCommand {
  static commandName = 'fmp:components'

  static description = 'Извлечение данных компонентов из экспорта FModel'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new ComponentsParser()

    await parser.parseFiles()
  }
}
