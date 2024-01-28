import { BaseModel, column } from '@adonisjs/lucid/orm'

export class GeneratorModel extends BaseModel {
  static table = 'generators'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare className: string

  @column()
  declare name: string

  @column()
  declare nameLocale: string

  @column()
  declare icon: string

  @column()
  declare recipeId: number

  @column()
  declare power: number
}
