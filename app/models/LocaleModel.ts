import { BaseModel, column } from '@adonisjs/lucid/orm'

export class LocaleModel extends BaseModel {
  static table = 'locales'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare lang: string

  @column()
  declare key: string

  @column()
  declare value: string
}
