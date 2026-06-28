/**
 * Migración para agregar columna categoryId a SuitCategories
 * y actualizar los datos existentes
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SuitCategories', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id',
      },
    });

    // Actualizar los datos existentes con categoryId correspondiente
    await queryInterface.update('SuitCategories', {
      categoryId: 1,
    }, {
      where: {
        id: {
          [Sequelize.Op.between]: [1, 3],
        },
      },
    });

    await queryInterface.update('SuitCategories', {
      categoryId: 2,
    }, {
      where: {
        id: {
          [Sequelize.Op.between]: [4, 6],
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('SuitCategories', 'categoryId');
  },
};
