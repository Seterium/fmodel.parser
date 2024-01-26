import type { CommandOptions } from '@adonisjs/core/types/ace'

import fs from 'fs'
import path from 'path'

import { BaseCommand } from '@adonisjs/core/ace'

import env from '#start/env'

import chalk from 'chalk'
import consola from 'consola'
import { globSync } from 'glob'

export default class Components extends BaseCommand {
  static commandName = 'fmp:components'

  static description = 'Parse components FModel data'

  static options: CommandOptions = {}

  async run() {
    const dir = path.join(env.get('FMODEL_EXPORTS_DIR'), 'Content/**/Desc_*.json').replaceAll('\\', '/')

    const files = globSync(dir)

    let count = 0

    for (const file of files) {
      const jsonData = JSON.parse(fs.readFileSync(file).toString())

      if (jsonData[0].SuperStruct.ObjectName.includes('FGItemDescriptor')) {
        consola.log(jsonData[1].Name)

        count += 1
      }
    }

    consola.log('count', count)
  }
}
