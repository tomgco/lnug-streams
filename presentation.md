%title: White water streams - Making your streams faster
%author: @tomgco
%date: 2015-10-28

-> When to use Streams? <-
=========

-> Data processing, flow control, all the time :D  <-

# What uses streams?

http, https, net, fs, process.std{in,out,err}, tls, tty, udp, zlib, crypto

(hint: pretty much everything in core)

## Data processing
-------------------------------------------------

-> # Database -> passthrough -> output  <-

Lets take a look at the following example.

Dump from a large dataset, passthrough the data and 
pump to an output file.

Lets for the sake of argument pretend that the database
and the output IO incurs no performance hit at all, Instead
lets focus on the stream implementation hooking these all together.

This passthrough stream is a duplex stream; it reads from the db and
writes to the csv stream.

-------------------------------------------------

-> # Example 1 <-

Lets read data from a dataset db in this case is a genome sequence and which 
is in a file - lets pretend that this is our database, will will pass this into
a transform steam that does some work; as we are testing the streams performance
we will just write a double to a buffer so we can ignore it in future output.

> Open 1.js

-------------------------------------------------

-> # Getting slow code <-

To benchmark we shall pipe this together and close when we are finished,
The first iteration I ran our function when a signal was sent to it, so I could
record what I needed from linux perf, without capturing the bootstrap of the app.

    process.on('SIGINT', () => doStuff);

-------------------------------------------------

-> # Finding slow code <-

Running this with linux perf:

    perf record -e cycles:u -g -p $PID

or 

    perf record -e cycles:u -g -- node --perf-basic-prof 1.js

then:

    perf script >! intermediate.out

To get the intermediate output.

-------------------------------------------------

-> # Flamegraphs! <-

    stackvis perf < intermediate.out >! flamegraph.html
    open flamegraph.html

> Open flamegraph.html

-------------------------------------------------

-> # Array.shift?? <-

We are spending a lot of time in the internal Array.shift methods, namly in the
`fromList` function within `_stream_readable.js` in node core.

-------------------------------------------------

-> # CORE??? <-

Lets look at *core*!

> ./node-stream-readable.sh

-------------------------------------------------

-> # Shifts are slow? <-

Array.shift is slow, *why*?

A -> B -> C;

Remove A and you will have to re-create the whole tree\*.

> Open image-1.png

-------------------------------------------------

-> # /r/popping <-

Lets test the speed difference between pop and shift.

> Open 2.js

> Note: we are not testing for correctness here.

-------------------------------------------------

-> # Increase Iterations! <-

> Open 3.js

-------------------------------------------------

-> # View the results <-

> Open: image-2.png

-------------------------------------------------

-> # Recap <-

We can improve the performance here, but what will happen with the rest of the
algorithm when you reverse how it works?

Benchmark everything, not just functions.

-------------------------------------------------

-> # Flamegraphs <-

Are a tool in our toolbox!

Can be useful, but will not help with all problems.

-------------------------------------------------

-> ## Last words <-

Thanks!

> Perf Workshop && NodeConf Barcelona
