'use strict';
// var fs = require('fs')
// var file = fs.readFileSync('./sativa-chemdawg.fa');
var file = { data: new Array(1e6)};
// file = file.toJSON();
// var heapdump = require('node-heapdump');

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
    // Using setImmediate in this case was correct,
    // but I am waiting too long for things to happen
    // this is just to speed up the profile.
    // process.nextTick(that.push.bind(that, buf));
    process.nextTick(function spush() {
      that.push(buf);
    });
  }
});

var ws = new stream.Writable({
  write: function(chunk, enc, next) {
    setImmediate(function writenextc() {
      next();
    });
  }
})

var pass = new stream.PassThrough();
var transform = new stream.Transform({
  transform: function(chunk, encoding, next) {
    chunk.writeDoubleLE(0xdeadbeefcafebabe, 0);
    next(null, chunk)
  },
  flush: function(done) {
    // sets this._flush under the hood
    done();
  }
});
console.log('Enter input now to start stream.');
console.log('PID:', process.pid);

// process.stdin.on('data', function (text) {
  rs
    .pipe(transform)
    .pipe(ws);
  ws.on('finish', function () {
    // heapdump.writeSnapshot(function () {
      process.nextTick(process.exit);
    // })
  });
// });
