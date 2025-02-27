'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            province: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            district: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ward: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            houseNumber: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Addresses');
    }
};