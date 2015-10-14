'use strict';

const pass = new stream.PassThrough();

process.stdin.pipe(pass).pipe(process.stdout);
