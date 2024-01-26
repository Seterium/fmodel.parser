import type { CommandOptions } from '@adonisjs/core/types/ace'

import fs from 'fs'

import { BaseCommand } from '@adonisjs/core/ace'

import chalk from 'chalk'
import consola from 'consola'

import { getFModelExports } from '#utils'

const FILES_SEARCH_PATTERN = 'Content/**/Desc_*.json'

export default class Components extends BaseCommand {
  static commandName = 'fmp:components'

  static description = 'Parse components FModel data'

  static options: CommandOptions = {}

  async run() {
    consola.start(`Запущен парсинг данных ${chalk.bold.greenBright('компонентов')}`)
    console.log()

    const files = getFModelExports(FILES_SEARCH_PATTERN)
  }
}
