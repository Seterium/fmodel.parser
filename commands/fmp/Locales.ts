import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { LocalesParser } from '#services'

import chalk from 'chalk'

export default class FMPLocales extends BaseCommand {
  static commandName = 'fmp:locales'

  static description = `Парсинг словарей ${chalk.bold.cyanBright('локализации')}`

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    await (new LocalesParser()).parseFiles()
  }
}
