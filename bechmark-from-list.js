'use strict';

var async = require('async');
var plotly = require('plotly')('tomgco', '02yl02ov0i');
var stats = require('stats-lite');
var crypto = require('crypto');

function fromListPop(n, state, cb) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode; // '' !!'' false
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) {
    return cb('non');
  }

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.pop();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else if (list.length === 1)
      ret = list[0];
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.pop();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else {
          list.pop();
        }
        c += cpy;
      }
    }

  }

  return cb(null, ret);
}
function fromList(n, state, cb) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode; // '' !!'' false
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0) {
    return cb('non');
  }

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else if (list.length === 1)
      ret = list[0];
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else {
          list.shift();
        }
        c += cpy;
      }
    }

  }

  return cb(null, ret);
}

function buildup() {
  bench('default', 1e4, fromList, (data) => {
    bench('pop', 1e4, fromListPop, (data2) => {
      var layout = {
        fileopt : 'overwrite',
        filename : 'fromlist',
      };

      plotly.plot([data, data2], layout, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
      });
    });

  });
}

function bench(name, iterations, fn, cb) {
  var times = [];
  var time = process.hrtime();
  async.times(iterations, (n, next) => {
    var state = {
      buffer: [crypto.randomBytes(12), crypto.randomBytes(1e5), crypto.randomBytes(1e1)],
      length: 1e5 + 1e1 + 12,
      decoder: false,
      objectMode: false,
    };
    var start = process.hrtime();
    fn.call(null, 666, state,function () {
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
      var newitems = times.splice(0,30);
      defaultMean.push(stats.mean(newitems));
      defaultMedian.push(stats.median(newitems));
      default85.push(stats.percentile(newitems, 0.85));
    }

    var data =
      { y: defaultMedian, type: 'scatter',
        mode: 'markers',
        name: name,
        marker:  { size: 3 },
      }


    return cb(data);
  });
}

function generateBufferData() {
  var newbuf = new Buffer(Math.random().toString(36));
  return newbuf;
}

buildup();
