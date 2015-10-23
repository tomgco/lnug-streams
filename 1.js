'use strict';

const fs = require('fs');
const stream = require('stream');
// const heapdump = require('node-heapdump');

const ws = fs.createWriteStream('./out/test.data');
const rs = fs.createReadStream('./sativa-chemdawg.fa');
const pass = new stream.PassThrough();

rs.pipe(pass).pipe(ws);
// ws.on('finish', function () {
  // heapdump.writeSnapshot(function () {
  //   process.nextTick(process.exit)
  // })
// });
