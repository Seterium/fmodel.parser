import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

import { GeneratorsParser } from '#services'

export default class Generators extends BaseCommand {
  static commandName = 'fmp:generators'

  static description = 'Parse generators FModel data'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const parser = new GeneratorsParser()

    await parser.parseFiles()
  }
}
