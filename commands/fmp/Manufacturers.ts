import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { ManufacturersParser } from '#services'

export default class Manufacturers extends BaseCommand {
  static commandName = 'fmp:manufacturers'

  static description = 'Parse manufacturers FModel data'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new ManufacturersParser()

    await parser.parseFiles()
  }
}
