# dopromise

## A Simple Promise Library for JavaScript

### Install
    $ npm install dopromise

### Usage
#### Nodejs
    var dopromise = require("dopromise")
    
    dopromise.serial(function1, function2, ...)
    dopromise.parallel(function1, function2, ...)

#### Browser
Just include "promise.js" script file. The global variable `dopromise` is made available to you.

### Example

The functions `dopromise.serial` and `dopromise.parallel` take a set of functions as its arguments. Each function is called with a `done` function, except the last function. You must call `done` from inside the function or inside the callback. You can mix synchronous and asynchronous functions.

In tha case of `serial`, if at any instance one of the functions wants to halt the operations, it can simply not call `done`. In the case of parallel every function MUST call `done`.

All the called functions are called with the same `this` object. So to pass values from one function to the other, or the last fucntion, just attach it to `this`. To access `this` inside a callback, save it as `that`, or if `bind` is supported use `bind`.

Serial example.  
The example below is a nodejs program to asynchronously copy an input file to an output file. It makes three asynchronous calls. `fs.exists`, `fs.readFile`, `fs.writeFile`

    var fs = require("fs");
    var dopromise = require("dopromise")
    
    dopromise.serial(
        function(done) {
            var that = this;
            this.infile = process.argv[2] || "";
            fs.exists(this.infile, function (exists) {
                if (exists) {
                    done();
                } else {
                    console.log("File does not exist: " + that.infile);
                }
            });
        },
        function(done) {
            this.outfile = process.argv[3];
            if (this.outfile) {
                done();
            } else {
                console.log("Output File Name is Required");
            }
        },
        function(done) {
            var that = this;
            fs.readFile(this.infile, function (err, data) {
                if (err) {
                    console.log("Error reading File: " + that.infile);
                } else {
                    that.contents = data;
                    done();
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

Parallel example.

    var dopromise = require('dopromise')
        request = require('request')
    
    dopromise.parallel(
        function(done) {
            request('http://www.example.com', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("got example")
                    this.example = body
                    done()
                }
            }.bind(this))       
        },
        function(done) {
            request('http://www.example2.com', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("got example2")
                    this.example2 = body
                    done()
                }
            }.bind(this))       
        },
        function() {
            console.log(this.example.length)
            console.log(this.example2.length)
        }
    )



