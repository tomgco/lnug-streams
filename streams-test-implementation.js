'use strict';
var async = require('async');
var plotly = require('plotly')('tomgco', '02yl02ov0i');
var fs = require('fs')
var file = fs.readFileSync('./xaa');
var stats = require('stats-lite')
// var file = { data: new Array(1e6)};
file = file.toJSON();
// var heapdump = require('node-heapdump');

var stream = require('stream');
var length = file.data.length;
var i = 0;

var buf = new Buffer('Hello, World!');

function test(cb) {
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

    rs
      .pipe(transform)
      .pipe(ws);
    ws.on('finish', function () {
      // heapdump.writeSnapshot(function () {
      cb();
      // })
    });
}
// });
function bench(iterations, fn) {
  var times = [];
  var time = process.hrtime();
  async.times(iterations, (n, next) => {
    var start = process.hrtime();
    fn.call(null, function () {
      // do stuff
      var diff = process.hrtime(start);
      var total = diff[0] * 1e9 + diff[1];
      // console.log('benchmark took %d nanoseconds for test "' + n + '"',
      //   total);
      times.push(total);
      next();
    });
  }, () => {
    var finaldiff = process.hrtime(time);
    var total = finaldiff[0] * 1e9 + finaldiff[1];
    // // console.log('benchmark took %d nanoseconds for all tests',
    // //   total);

    var defaultMean = [];
    var defaultMedian = [];
    var default85 = [];

    while(times.length) {
      var newitems = times.splice(0,1);
      defaultMean.push(stats.mean(newitems));
      defaultMedian.push(stats.median(newitems));
      default85.push(stats.percentile(newitems, 0.85));
    }

    var data = [
      { y: defaultMedian, type: 'scatter',
        mode: 'markers',
        name: 'Time',
        marker:  { size: 3 },
      }
    ];

    var layout = {
      fileopt : 'overwrite',
      filename : 'fromlist',
    };

    plotly.plot(data, layout, function (err, msg) {
      if (err) return console.log(err);
      console.log(msg);
    });

  });
}

bench(13, test);
