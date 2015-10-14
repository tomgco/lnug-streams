'use strict';

const fs = require('fs');
const stream = require('stream');

const ws = fs.createWriteStream('./out/test.data');
const rs = fs.createReadStream('./windnasalow.csv');
const pass = new stream.PassThrough();

rs.pipe(pass).pipe(ws);
