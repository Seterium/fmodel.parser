import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'fuels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('component_id').notNullable()
      table.integer('generator_id').notNullable()
      table.float('energy').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
