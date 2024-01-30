import { BaseModel, column } from '@adonisjs/lucid/orm'

export class GeneratorModel extends BaseModel {
  static table = 'generators'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare classId: number

  @column()
  declare modId: number | null

  @column()
  declare icon: string

  @column()
  declare name: string

  @column()
  declare nameLocale: string

  @column()
  declare description: string

  @column()
  declare descriptionLocale: string

  @column()
  declare power: number

  @column()
  declare parentClassId: number | null

  @column()
  declare supplementalComponentId: number | null

  @column()
  declare supplementalToPowerRatio: number | null
}
