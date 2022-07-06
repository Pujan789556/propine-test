#!/usr/bin/env node
const dotenv = require( "dotenv" );
const yargs = require('yargs');
const axios = require("axios");
const Portfolio = require('./portfolio');
const { Op, literal } = require("sequelize");

dotenv.config();
const db = require('./db');

const options  = yargs
    .usage("Usage -t <token>")
    .option("t", {alias: "token", describe:"Token (BTC/ETH/XRP)", type: "string", choices: ['BTC', 'ETH', 'XRP']})
    .option("d", {alias: "date", describe:"Date (YYYY/MM/DD)", type: "string"})
    .argv;

const _getRates = () => new Promise((resolve, rejects) => {
    axios.get(process.env.API_ENDPOINT, { headers: { authorization: `Apikey ${process.env.API_KEY}` } })
    .then(res => {
     resolve(res.data);
    });
});

const _calculate = async (data) => {
    const rate = await _getRates();
    var portfolio = {};
    data.map(row => {
        portfolio[row.token] = row.total * rate[row.token].USD;
    });
    return portfolio;
}

const _getData = (date, token) => new Promise(async (resolve, reject) => {
    if(date && token) {
        const provDate = new Date(date);
        const startEpoch = provDate.getTime() / 1000;
        const endEpoch = provDate.setDate(provDate.getDate() + 1);
        Portfolio.findAll({
            attributes: [
                'token',
                [literal(`SUM(CASE transaction_type WHEN 'DEPOSIT' THEN amount
                                WHEN 'WITHDRAWAL' THEN -amount END)`), 'total']
            ],
            group: ['token'],
            where: {
                timestamp: {
                    [Op.and]: {
                      [Op.gte]: startEpoch,
                      [Op.lt]: endEpoch
                    }
                  },
                token: token
            } 
        }).then((rows) => {
            resolve (rows.map((r) => r.dataValues));
        })
    } else if (date) {
        const provDate = new Date(date);
        const startEpoch = provDate.getTime() / 1000;
        const endEpoch = provDate.setDate(provDate.getDate() + 1) / 1000;
        Portfolio.findAll({
            attributes: [
                'token',
                [literal(`SUM(CASE transaction_type WHEN 'DEPOSIT' THEN amount
                                WHEN 'WITHDRAWAL' THEN -amount END)`), 'total']
            ],
            group: ['token'],
            where: {
                timestamp: {
                    [Op.and]: {
                      [Op.gte]: startEpoch,
                      [Op.lt]: endEpoch
                    }
                  }
            } 
        }).then((rows) => {
            resolve (rows.map((r) => r.dataValues));
        })
    } else if (token) {
        Portfolio.findAll({
            attributes: [
                'token',
                [literal(`SUM(CASE transaction_type WHEN 'DEPOSIT' THEN amount
                                WHEN 'WITHDRAWAL' THEN -amount END)`), 'total']
            ],
            group: ['token'],
            where: {
                token: token
            } 
        }).then((rows) => {
            resolve (rows.map((r) => r.dataValues));
        })
    } else {
        Portfolio.findAll({
            attributes: [
                'token',
                [literal(`SUM(CASE transaction_type WHEN 'DEPOSIT' THEN amount
                                WHEN 'WITHDRAWAL' THEN -amount END)`), 'total']
            ],
            group: ['token']
        }).then((rows) => {
            resolve (rows.map((r) => r.dataValues));
        })
    }
}) 
const calculatePortfolio = async (params) => {   
    var data = []; 
    if(params.date && params.token) {
        data = await _getData(params.date, params.token);
    } else if(params.date) {
        data = await _getData(params.date);
    } else if(params.token) {
        data = await _getData(null, params.token);
    } else {
        data = await _getData();
    }
    const  portfolio = await _calculate(data);
    console.log('Portfolio', portfolio);
    process.exit();
}

// Portfolio.sync();
calculatePortfolio(options);
     