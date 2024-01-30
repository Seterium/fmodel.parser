import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fuels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('generator_class_id').notNullable()
      table.integer('component_id').notNullable()
      table.float('energy').notNullable()
      table.integer('waste_component_id').nullable()
      table.float('waste_amount').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
