const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Products = sequelize.define('product',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    img: Sequelize.TEXT('long'),
    price: Sequelize.FLOAT,
    name: Sequelize.STRING,
    category: Sequelize.STRING
});

module.exports = Products;