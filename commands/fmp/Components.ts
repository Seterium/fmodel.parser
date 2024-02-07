import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'
import { ComponentsParser } from '#services'

import chalk from 'chalk'

export default class Components extends BaseCommand {
  static commandName = 'fmp:components'

  static description = `Парсинг данных ${chalk.bold.cyanBright('предметов')} (сырья, деталей)`

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new ComponentsParser()

    await parser.parseFiles()
  }
}
