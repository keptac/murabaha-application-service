
const { Level } = require('level')    
const path = require('path');

const dbPath = path.join(__dirname,'..','data','funderjet_storage');
const db = new Level(dbPath,{ valueEncoding: 'json' });


module.exports = db;


