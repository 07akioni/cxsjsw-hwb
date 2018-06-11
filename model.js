const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize('db', 'username', 'password', {
  dialect: 'sqlite',
  storage: path.resolve(__dirname, 'metro.sqlite')
})

/*
 * 站点 Model
 */
const Stop = sequelize.define('stop', {
  name: Sequelize.STRING,
  line: Sequelize.STRING
})

/*
 * 距离 Model
 */
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