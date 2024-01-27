import { BaseModel, column } from '@adonisjs/lucid/orm'

export class RecipeOutputModel extends BaseModel {
  table = 'recipes_outputs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare recipeId: number

  @column()
  declare componentId: number

  @column()
  declare amount: number
}
