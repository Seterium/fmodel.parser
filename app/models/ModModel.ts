import { BaseModel, column } from '@adonisjs/lucid/orm'

export class Mod extends BaseModel {
  table = 'mods'

  @column({ isPrimary: true })
  declare id: number
}
