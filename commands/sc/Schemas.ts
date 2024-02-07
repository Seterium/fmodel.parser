import type { CommandOptions } from '@adonisjs/core/types/ace'

import { BaseCommand } from '@adonisjs/core/ace'

export default class SCSchemas extends BaseCommand {
  static commandName = 'sc:schemas'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SCSchemas"')
  }
}
