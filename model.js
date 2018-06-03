const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize('db', 'username', 'password', {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, 'metro.sqlite')
})

const Stop = sequelize.define('stop', {
  name: Sequelize.STRING,
  line: Sequelize.STRING
})

const Distance = sequelize.define('distance', {
  from: Sequelize.INTEGER,
  to: Sequelize.INTEGER,
  distance: Sequelize.INTEGER
})

module.exports = {
  models: {
    Stop,
    Distance
  },
  syncDb: () => {
    return sequelize.sync()
  }
}