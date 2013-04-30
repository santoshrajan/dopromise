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
    };


    exports.version = "0.0.2"
    exports.doPromise = serial  // for backward compatability
    exports.serial = serial

})(typeof exports === 'undefined'? this.dopromise={}: exports);
