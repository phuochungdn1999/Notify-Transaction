import { DataTypes, literal, QueryInterface, Sequelize } from "sequelize"

export const up = async (
  queryInterface: QueryInterface,
  Sequelize: Sequelize
) => {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('user', { id: Sequelize.INTEGER });
   */
  return queryInterface.sequelize
    .query(
      'ALTER TABLE "Event" DROP CONSTRAINT IF EXISTS "Event_transHash_key";'
    )
    .then((res) => {
      console.log(res)
    })
    .catch(err => {console.log(err)})
  
}

export const down = (queryInterface: QueryInterface, Sequelize: Sequelize) => {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('user');
   */
}
