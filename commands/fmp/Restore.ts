import type { CommandOptions } from '@adonisjs/core/types/ace'

import fs from 'fs'
import path from 'path'

import { BaseCommand } from '@adonisjs/core/ace'

import { ClassIdModel } from '#models'

import chalk from 'chalk'
import consola from 'consola'
import { globSync } from 'glob'
import unzipper from 'unzipper'

import { DUMP_FILE_NAME } from '#constants'

export default class FMPRestore extends BaseCommand {
  static commandName = 'fmp:restore'

  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const dumpPath = this.getDumpArchivePath()

    if (dumpPath === null) {
      return
    }

    const dumpData = await this.exportDumpDataFromZip(dumpPath)

    if (dumpData === null) {
      return
    }

    await this.restoreClassesIdsTableFromDump(dumpData)
  }

  private getDumpArchivePath(): string | null {
    const filepath = globSync(path.join(process.cwd(), `${DUMP_FILE_NAME}-*.zip`).replaceAll('\\', '/')).pop()

    if (filepath === undefined) {
      consola.error('Не удалось найти архив дампа')

      return null
    }

    return filepath
  }

  private async exportDumpDataFromZip(dumpPath: string): Promise<string | null> {
    const zip = fs.createReadStream(dumpPath).pipe(unzipper.Parse({ forceStream: true }))

    for await (const entry of zip) {
      if (entry.path === 'classesIds.psv') {
        const content: Buffer = await entry.buffer()

        return content.toString()
      }

      entry.autodrain()
    }

    consola.error(
      `Не удалось найти файл ${chalk.bold.yellowBright('classesIds.psv')}`,
      `в архиве ${chalk.bold.yellowBright(dumpPath)}`,
    )

    return null
  }

  private async restoreClassesIdsTableFromDump(dump: string): Promise<void> {
    const parsed = dump.split('||').map((dumpItem) => {
      const [id, className] = dumpItem.split('|')

      return {
        id: parseInt(id, 10),
        class: className,
      }
    })

    for (const el of parsed) {
      await ClassIdModel.firstOrCreate({
        id: el.id,
        class: el.class,
      })
    }

    consola.success(`Данные таблицы ${chalk.bold.cyanBright('classes_ids')} восстановлены из дампа`)
  }
}
