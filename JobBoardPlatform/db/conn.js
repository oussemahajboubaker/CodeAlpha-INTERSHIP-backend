const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("jobdb", "root", "@mb8955182591", {
    host: "localhost",
    dialect: "mysql"
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection to database has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
