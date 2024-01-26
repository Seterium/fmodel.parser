import { column } from '@adonisjs/lucid/orm'

import { IngameObjectModel } from '#models/abstracts'

export abstract class IngameObjectWithDescModel extends IngameObjectModel {
  @column()
  declare description: string

  @column()
  declare descriptionLocale: string
}
