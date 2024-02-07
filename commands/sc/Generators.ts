import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

export default class SCGenerators extends BaseCommand {
  static commandName = 'sc:generators'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SCGenerators"')
  }
}
