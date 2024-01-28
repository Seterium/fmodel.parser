import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'blueprints_components'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('building_class_id')
      table.integer('component_class_id')
      table.float('amount')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
