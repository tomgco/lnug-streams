'use strict';

const fs = require('fs');
const stream = require('stream');

const ws = fs.createWriteStream('./out/test.data');
const rs = fs.createReadStream('./sativa-chemdawg.fa');
const pass = new stream.PassThrough();

rs.pipe(pass).pipe(ws);
