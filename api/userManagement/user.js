const {DataTypes,Model} = require('sequelize');
const sequelize = require("../../config/datasource-db");

class User extends Model{}

User.init({
    name:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    password:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    
})