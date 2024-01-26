import type { CommandOptions } from '@adonisjs/core/types/ace'

import fs from 'fs'
import path from 'path'

import { BaseCommand } from '@adonisjs/core/ace'

import env from '#start/env'

import chalk from 'chalk'
import consola from 'consola'
import { globSync } from 'glob'

export default class Generators extends BaseCommand {
  static commandName = 'fmp:generators'

  static description = 'Parse generators FModel data'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Hello world from "Generators"')
  }
}
