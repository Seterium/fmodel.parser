import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

export default class SmrAdd extends BaseCommand {
  static commandName = 'smr:add'
  static description = ''

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "SmrAdd"')
  }
}