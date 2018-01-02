const { STRING } = require('sequelize')

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Boletos', 'issuer_wallet', {
      type: STRING
    }
  ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Boletos', 'issuer_wallet')
}