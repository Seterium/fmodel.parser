import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SmrLoad extends BaseCommand {
  static commandName = 'smr:load'

  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SmrLoad"')
  }
}
