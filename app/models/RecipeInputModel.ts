import { BaseModel, column } from '@adonisjs/lucid/orm'

export class RecipeInputModel extends BaseModel {
  static table = 'recipes_inputs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare recipeClassId: number

  @column()
  declare componentClassId: number

  @column()
  declare amount: number
}
