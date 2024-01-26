import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SmrView extends BaseCommand {
  static commandName = 'smr:view'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SmrView"')
  }
}