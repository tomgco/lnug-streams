'use strict';
var fs = require('fs')
var file = fs.readFileSync('./xac');
// var file = { data: new Array(1e6)};
file = file.toJSON();
var heapdump = require('node-heapdump');

var stream = require('stream');
var length = file.data.length;
var i = 0;

var buf = new Buffer('Hello, World!');

var rs = new stream.Readable({
  read: function(n) {
    if (i >= length) {
      return this.push(null);
    }
    i++;
    var that = this;
    setImmediate(function () {

    that.push(buf);
    })
  }
});

var ws = new stream.Writable({
  write: function(chunk, enc, next) {
    setImmediate(function () {
    next();
    })
  }
})

var pass = new stream.PassThrough();

process.stdin.on('data', function (text) {
  rs
    .pipe(pass)
    .pipe(ws);
  ws.on('finish', function () {
    heapdump.writeSnapshot(function () {
      process.nextTick(process.exit);
    })
  });
});
