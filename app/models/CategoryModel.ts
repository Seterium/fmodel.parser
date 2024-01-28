import { BaseModel, column } from '@adonisjs/lucid/orm'

export class CategoryModel extends BaseModel {
  static table = 'categories'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare name: string

  @column()
  declare nameLocale: string

  @column()
  declare modId: number | null
}
