import { BaseModel, column } from '@adonisjs/lucid/orm'

export class BlueprintComponentModel extends BaseModel {
  static table = 'blueprints_components'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare buildingClassId: number

  @column()
  declare componentClassId: number

  @column()
  declare amount: number
}
