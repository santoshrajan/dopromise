# dopromise

## A Simple Promise Library for JavaScript

`dopromise` allows you to call handler(s) in series, parallel or in a loop. Each handler (function) is called with a `done` function, and the `this` inside the handler is set to a an object that will remain the same across all handlers. You can use `this` to pass data across handlers.

### Install
    $ npm install dopromise

### Usage
#### Nodejs
    var dopromise = require("dopromise")
    
    dopromise.serial(handler1, handler2, ...)
    dopromise.parallel(handler1, handler2, ...)
    dopromise.loop(handler)

#### Browser
Just include "promise.js" script file. The global variable `dopromise` is made available to you.

`dopromise.serial` will call its handlers in series. Each handler must call `done` from within a callback inside the handler. If the handler is synchronous call `done` from the handler itself. If at any time you want to halt the operations (due to an error), just don't call `done`. The last handler is not called with `done`.

The example below is a nodejs program to asynchronously copy an input file to an output file. It makes three asynchronous calls. `fs.exists`, `fs.readFile`, `fs.writeFile`. Notice that we `bind` `this` to the callbacks.

    var fs = require("fs");
    var dopromise = require("dopromise")
    
    dopromise.serial(
        function(done) {
            this.infile = process.argv[2] || "";
            fs.exists(this.infile, function (exists) {
                if (exists) {
                    done();
                } else {
                    console.log("File does not exist: " + this.infile)
                }
            }.bind(this))
        },
        function(done) {
            this.outfile = process.argv[3]
            if (this.outfile) {
                done();
            } else {
                console.log("Output File Name is Required")
            }
        },
        function(done) {
            fs.readFile(this.infile, function (err, data) {
                if (err) {
                    console.log("Error reading File: " + this.infile)
                } else {
                    this.contents = data
                    done()
                }
            }.bind(this))
        },
        function() {
            fs.writeFile(this.outfile, this.contents, function (err) {
                if (err) {
                    console.log("Error writing File: " + this.outfile)
                }
            }.bind(this))
        }
    )

`dopromise.parallel` will call the handlers in parallel. All the handlers MUST call `done`. In the example below we send two http requests in parallel. And attach the result (body) to `this`. The last handler is called after all the handlers have resolved. In the last handler we just print the lengths of the responses.

    var dopromise = require('dopromise')
        request = require('request')
    
    dopromise.parallel(
        function(done) {
            request('http://www.example.com', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("got example")
                    this.example = body
                    done()
                } else {
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
                } else {
                    done()
                }
            }.bind(this))       
        },
        function() {
            console.log(this.example.length)
            console.log(this.example2.length)
        }
    )

`dopromise.loop` will call a single handler repeatedly. You must call `done` from within the handler to to continue the loop. You must also implement an escape condition inside the loop. Just dont call `done` if the escape condition is met.

In the example below we will implement a simple task runner. The tasks are given in an array. Each time the handler is called it will shift out the first task, and call `exec` on the child process. It will exit when the array is empty.

    var dopromise = require("dopromise"),
        _exec = require('child_process').exec,
        start = new Date(),
        commands = [
            'jshint run.js',
            'uglifyjs run.js -o run.min.js -c -m'
        ]
    
    dopromise.loop(
        function(done) {
            var cmd = commands.shift()
            if (cmd) {
                console.log('Running command: ' + cmd)
                _exec(cmd, function (error, stdout, stderr) {
                    if (error) {
                        console.log(stderr)
                    } else {
                        console.log(stdout)
                        done()
                    }
                })
            } else {
                console.log('Done all tasks in ' + (new Date() - start) + 'ms')
            }
        }
    )

