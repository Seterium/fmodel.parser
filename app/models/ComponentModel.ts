import { column } from '@adonisjs/lucid/orm'

import { IngameObjectWithDescModel } from '#models/abstracts'

export class ComponentModel extends IngameObjectWithDescModel {
  @column()
  declare icon: string
}
