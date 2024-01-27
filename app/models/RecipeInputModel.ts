import { BaseModel, column } from '@adonisjs/lucid/orm'

export class RecipeInputModel extends BaseModel {
  table = 'recipes_inputs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare recipeId: number

  @column()
  declare componentId: number

  @column()
  declare amount: number
}
