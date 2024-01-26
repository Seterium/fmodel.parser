import { column } from '@adonisjs/lucid/orm'

import { IngameObjectModel } from '#models/abstracts'

export default class RecipeModel extends IngameObjectModel {
  @column()
  declare manufacturerId: number

  @column()
  declare manufacturingDuration: number

  @column()
  declare energyConsumption: number | null
}
