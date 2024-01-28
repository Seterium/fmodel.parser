import { BaseModel, column } from '@adonisjs/lucid/orm'

export class Mod extends BaseModel {
  static table = 'mods'

  @column({ isPrimary: true })
  declare id: number
}
