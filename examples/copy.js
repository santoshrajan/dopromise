var fs = require("fs");
var dopromise = require("dopromise")

dopromise.serial(
    function(continuation) {
        var that = this
        this.infile = process.argv[2] || ""
        fs.exists(this.infile, function (exists) {
            if (exists) {
                continuation()
            } else {
                console.log("File does not exist: " + that.infile)
            }
        })
    },
    function(continuation) {
        this.outfile = process.argv[3];
        if (this.outfile) {
            continuation()
        } else {
            console.log("Output File Name is Required")
        }
    },
    function(continuation) {
        var that = this
        fs.readFile(this.infile, function (err, data) {
            if (err) {
                console.log("Error reading File: " + that.infile)
            } else {
                that.contents = data
                continuation()
            }
        });
    },
    function() {
        var that = this
        fs.writeFile(this.outfile, this.contents, function (err) {
            if (err) {
                console.log("Error writing File: " + that.outfile)
            }
        })
    }
)
