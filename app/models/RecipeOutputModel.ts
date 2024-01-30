import { BaseModel, column } from '@adonisjs/lucid/orm'

export class RecipeOutputModel extends BaseModel {
  static table = 'recipes_outputs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare recipeClassId: number

  @column()
  declare componentClassId: number

  @column()
  declare amount: number
}
