import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { ManufacturersParser } from '#services'

import chalk from 'chalk'

export default class Manufacturers extends BaseCommand {
  static commandName = 'fmp:manufacturers'

  static description = `Парсинг данных ${chalk.bold.cyanBright('производящих построек')}`

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new ManufacturersParser()

    await parser.parseFiles()
  }
}
