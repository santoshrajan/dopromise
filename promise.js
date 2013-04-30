/*
    dopromise
    Promise Library for JavaScript
    Copyright (c) 2013 Santosh Rajan
    License - MIT - https://github.com/santoshrajan/dopromise/blob/master/LICENSE
*/

(function(exports){

    var serial = function() {
        var args = arguments, scope = {}
        function iterator(i) {
            var func = args[i]
            if (args.length === i + 1) {
                func.call(scope)
            } else {
                func.call(scope, function() {
                    iterator(i + 1)
                })
            }
        }
        iterator(0);
    }

    var parallel = function() {
        var args = Array.prototype.slice.call(arguments),
            last = args.pop()
            counter = args.length
            scope = {}
            done = function() {
                --counter
                if (counter === 0) {
                    last.call(scope)
                }
            }

        args.forEach(function(f) {
            f.call(scope, done)
        })
    }

    exports.version = "0.0.3"
    exports.doPromise = serial  // for backward compatability
    exports.serial = serial
    exports.parallel = parallel

})(typeof exports === 'undefined'? this.dopromise={}: exports);
