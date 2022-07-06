#!/usr/bin/env node
const fs = require('fs');
const csv = require('csv-parser');
const db = require('./db');
const Portfolio = require('./portfolio');
const _ = require('highland');

db.authenticate().then(async () => {
    console.log('Database connected...');
    await Portfolio.sync();
    readCsvFile();
}).catch(err => {
    console.log('Error: ' + err);
})

const readCsvFile = () => {
    let currentIndex = 0;
    const stream = _(
        fs.createReadStream('bin/transactions.csv').pipe(
        csv({
            separator: ',',
        })
        )
    )
.map(row => row)
.batch(1000)
.each(entries => {
        stream.pause();
        currentIndex += 1000;
        Portfolio.bulkCreate(entries).then('Imported: ', currentIndex)
        stream.resume();
})
.on('end', () => {
    console.log('done');
    process.exit();
    });
};
 
     