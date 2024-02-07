import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { RecipesParser } from '#services'

import chalk from 'chalk'

export default class Recipes extends BaseCommand {
  static commandName = 'fmp:recipes'

  static description = `Парсинг данных ${chalk.bold.cyanBright('рецептов')}`

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new RecipesParser()

    await parser.parseFiles()
  }
}
