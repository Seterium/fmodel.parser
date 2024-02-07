import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { CategoriesParser } from '#services'

import chalk from 'chalk'

export default class Categories extends BaseCommand {
  static commandName = 'fmp:categories'

  static description = `Парсинг данных ${chalk.bold.cyanBright('категорий')}`

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new CategoriesParser()

    await parser.parseFiles()
  }
}
