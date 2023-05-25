const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Book = sequelize.define("book",{
    kitapno: {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true
    },
    kitapadi:{
        type: DataTypes.STRING,
        allowNull : false
    },
    yazaradi: {
        type : DataTypes.STRING,
        allowNull: false
    },
    yayinevi : {
        type : DataTypes.STRING,
        allowNull : false
    },
    sayfasayisi : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    kategori : {
        type : DataTypes.STRING,
        allowNull : false
    },
    resim : {
        type : DataTypes.STRING,
        allowNull : false
    },

}, {
    timestamps: true
});


module.exports = Book;