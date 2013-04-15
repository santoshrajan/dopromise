# dopromise

## A Simple Promise Library for JavaScript

### Install
    $ npm install dopromise

### Usage
#### Nodejs
    var doPromise = require("dopromise").doPromise;
#### Browser
Just include "promise.js" script file. The global variable `dopromise` is made available to you.

### Example

The function `doPromise` takes a set of functions as its arguments. Each function is called with a `continuation` function, except the last function. 

The called function promises to call the `continuation` from within it. It may call the `continuation` synchronously or asynchronously (from inside a callback).

If at any instance one of the functions wants to halt the operations, it can simply not call the `continuation`.

All the called functions are called with the same `this`. So to pass values from one function to the other, just attach it to `this`. To access `this` inside a callback, save it as `that`, before making the async call.

The example below is a nodejs program to asynchronously copy an input file to an output file. It makes three asynchronous calls. `fs.exists`, `fs.readFile`, `fs.writeFile`

    var fs = require("fs");
    var doPromise = require("dopromise").doPromise;
    
    doPromise(
        function(continuation) {
            var that = this;
            this.infile = process.argv[2] || "";
            fs.exists(this.infile, function (exists) {
                if (exists) {
                    continuation();
                } else {
                    console.log("File does not exist: " + that.infile);
                }
            });
        },
        function(continuation) {
            this.outfile = process.argv[3];
            if (this.outfile) {
                continuation();
            } else {
                console.log("Output File Name is Required");
            }
        },
        function(continuation) {
            var that = this;
            fs.readFile(this.infile, function (err, data) {
                if (err) {
                    console.log("Error reading File: " + that.infile);
                } else {
                    that.contents = data;
                    continuation();
                }
            });
        },
        function() {
            var that = this;
            fs.writeFile(this.outfile, this.contents, function (err) {
                if (err) {
                    console.log("Error writing File: " + that.outfile);
                }
            });
        }
    );




