import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'
import { CategoriesParser } from '#services'

export default class Categories extends BaseCommand {
  static commandName = 'fmp:categories'

  static description = 'Извлечение данных категорий компонентов из экспорта FModel'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new CategoriesParser()

    await parser.parseFiles()
  }
}
