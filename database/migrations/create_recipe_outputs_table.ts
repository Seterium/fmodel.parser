import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'recipe_outputs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('recipe_id').notNullable()
      table.integer('component_id').notNullable()
      table.float('amount').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
