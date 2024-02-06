import type { CommandOptions } from '@adonisjs/core/types/ace'

import fs from 'fs'
import path from 'path'

import { BaseCommand } from '@adonisjs/core/ace'

import { ClassIdModel } from '#models'

import bytes from 'bytes'
import chalk from 'chalk'
import consola from 'consola'
import archiver from 'archiver'
import { globSync } from 'glob'

const DUMP_FILE_NAME = 'dump'

export default class FMPDump extends BaseCommand {
  static commandName = 'fmp:dump'

  static description = ''

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.removeOldDump()

    const data = await this.exportClassIdData()

    await this.saveDumpArchive(data)
  }

  private removeOldDump() {
    const filename = globSync(path.join(process.cwd(), `${DUMP_FILE_NAME}-*.zip`).replaceAll('\\', '/')).pop()

    if (filename === undefined) {
      return
    }

    fs.rmSync(filename)
  }

  private async exportClassIdData(): Promise<string> {
    const data = await ClassIdModel.query().orderBy('id', 'asc')

    return data.map((el) => `${el.id}|${el.class}`).join('||')
  }

  private async saveDumpArchive(data: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filename = `${DUMP_FILE_NAME}-${Date.now()}`

      const output = fs.createWriteStream(
        path.join(process.cwd(), `${filename}.zip`),
      )

      const archive = archiver('zip', {
        zlib: {
          level: 9,
        },
      })

      output.on('close', () => {
        consola.success(`Архив дампа таблицы ${chalk.bold.cyanBright('classes_ids')} сохранен`)
        consola.info(`Имя: ${chalk.bold.cyanBright(`${filename}.zip`)}`)
        consola.info(`Размер: ${chalk.bold.yellowBright(bytes(archive.pointer()))}`)
        resolve()
      })

      // output.on('end', () => {
      //   console.log('Data has been drained')

      //   resolve()
      // })

      archive.on('warning', (error) => {
        if (error.code === 'ENOENT') {
          consola.warn(error)
        } else {
          reject(error)
        }
      })

      archive.on('error', (error) => {
        throw error
      })

      archive.pipe(output)

      archive.append(Buffer.from(data, 'utf-8'), {
        name: `${filename}.psv`,
      })

      archive.finalize()
    })
  }
}
