
const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");

const Jobs = sequelize.define("jobs", {
    jobtitle: { type: DataTypes.STRING, allowNull: false },
    company: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    experienceInYear: { type: DataTypes.INTEGER, allowNull: false },
    salaryInLPA: { type: DataTypes.INTEGER, allowNull: false },
    jobdescription: { type: DataTypes.STRING, allowNull: false }
});

sequelize.sync().then(() => {
    console.log('user table created successfully!');

}).catch((error) => {
    console.error('Unable to create table : ', error);
});
module.exports = Jobs;
