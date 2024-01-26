import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'class_ids'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('class').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
