import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'mods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('smr_id').notNullable()
      table.string('slug').notNullable()
      table.string('name').notNullable()
      table.string('icon').notNullable()
      table.string('version').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
