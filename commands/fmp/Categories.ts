import { BaseCommand } from '@adonisjs/core/ace'

import type { CommandOptions } from '@adonisjs/core/types/ace'

import { CategoriesParser } from '#services'

export default class Categories extends BaseCommand {
  static commandName = 'fmp:categories'

  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new CategoriesParser()

    await parser.parseFiles()
  }
}
