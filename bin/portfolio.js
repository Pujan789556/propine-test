#!/usr/bin/env node
const Sequelize = require('sequelize');
const db = require('./db');

const Portfolio = db.define('Portfolio', 
{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    timestamp: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    transaction_type: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
    }
},
{
    // indexes: [
    // {
    //     unique: true,
    //     fields:['id'],

    // },
    // {
    //   unique: true,
    //   fields:['id', 'timestamp'],

    // },
    // {
    //   unique: true,
    //   fields:['id', 'token'],

    // },
    // {
    //     unique: false,
    //     fields: ['timestamp', 'token']
    // },
    // {
    //     unique: false,
    //     fields: ['transaction_type', 'token', 'amount']
    // },
    // ],
    tableName: "Portfolio",
}
);

module.exports = Portfolio;