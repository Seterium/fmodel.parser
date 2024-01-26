import { column } from '@adonisjs/lucid/orm'

import { IngameObjectModel } from '#models/abstracts'

export abstract class BuildingModel extends IngameObjectModel {
  @column()
  declare recipeId: number

  @column()
  declare icon: string
}
