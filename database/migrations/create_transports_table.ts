import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transports'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('class_name').notNullable()
      table.integer('class_id').notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.string('locale').notNullable()
      table.integer('recipe_id').notNullable()
      table.boolean('is_pipe').notNullable()
      table.float('throughput').notNullable()
      table.string('icon').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
