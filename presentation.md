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

Lets read data from the dataset "Wind data from NASA" and write that to
a file.

> Open 1.js

# first-level

-------------------------------------------------

-> # Supported markdown formatting <-

Second-level headers can be prefixed by *##* or
underlined by *---*.

second-level
\------------

becomes

second-level
------------


-------------------------------------------------

-> # Supported markdown formatting's <-

Inline codes are surrounded with backticks.

C program starts with \`main()\`.

becomes

C program starts with `main()`.

-------------------------------------------------

-> # Supported markdown formatting <-

Code blocks are automatically detected by 4
spaces at the beginning of a line.

Tabs are automatically expanded to 4 spaces
while parsing the input.

\    int main(int argc, char \*argv[]) {
\        printf("%s\\n", "Hello world!");
\    }

becomes

    int main(int argc, char *argv[]) {
        printf("%s\n", "Hello world!");
    }

-------------------------------------------------

-> # Supported markdown formatting <-

Quotes are auto-detected by preceding *>*.

Multiple *>* are interpreted as nested quotes.

\> quote
\>> nested quote 1
\> > nested quote 2

becomes

> quote
>> nested quote 1
> > nested quote 2

-------------------------------------------------

-> # Supported markdown formatting <-

Inline highlighting is supported as followed:

\- *\** colors text as red
\- *\_* underlines text

\_some\_ \*highlighted\* \_\*text\*\_

becomes

_some_ *highlighted* _*text*_

-------------------------------------------------

-> # Supported markdown formatting <-

Backslashes force special markdown characters
like *\**, *\_*, *#* and *>* to be printed as normal
characters.

\\\*special\\\*

becomes

\*special\*

-------------------------------------------------

-> # Supported markdown formatting <-

Leading *\** or *-* indicate lists.

list
\* major
\    - minor
\        - \*important\*
\          detail
\    - minor

becomes

list
* major
    - minor
        - *important*
          detail
    - minor

-------------------------------------------------

-> # Supported markdown formatting <-

A single *\<br\>* or *^* in a line indicates mdp
to stop the output on that position.

This can be used to show bullet points
line by line.

*\<br\>* is also not displayed in HTML converted
output.

Agenda
<br>
* major
<br>
    * minor
<br>
* major
  ^
    * minor
      ^
        * detail

-------------------------------------------------

-> # Supported markdown formatting <-

Leading *->* indicates centering.

\-> # test <-
\-> ## test <-
\-> test
\-> \_\*test\*\_ <-

becomes

-> # test <-
-> ## test <-
-> test
-> _*test*_ <-

-------------------------------------------------

-> # Supported markdown formatting <-

URL in pandoc style are supported:

\[Google](http://www.google.com/)

becomes

[Google](http://www.google.com/)

-------------------------------------------------

-> ## More information about markdown <-

can be found in the [markdown documentation](http://daringfireball.net/projects/markdown/).

-------------------------------------------------

-> # Support for UTF-8 special characters <-

Here are some examples.

ae = ä, oe = ö, ue = ü, ss = ß
upsilon = Ʊ, phi = ɸ

▛▀▀▀▀▀▀▀▀▀▜
▌rectangle▐
▙▄▄▄▄▄▄▄▄▄▟


-------------------------------------------------

-> # Suspend your presentation for hands-on examples <-

Use *Ctrl + z* to suspend the presentation.

Use *fg* to resume it.

-------------------------------------------------

-> # Convert your presentation to PDF <-

To publish your presentation later on, you may
want to convert it to PDF.

This can be achieved by two additional tools:

\- *markdown* to convert to HTML
\- *wkhtmltopdf* to convert from HTML to PDF

After installing them, you can simply type:

    $ markdown sample.md | wkhtmltopdf - sample.pdf

-------------------------------------------------

-> ## Last words <-

I hope you like *mdp*. But be aware that it is
still in alpha status.

If you observe strange behavior, feel free to
open an issue on [GitHub](https://github.com/visit1985/mdp).
