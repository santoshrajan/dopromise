var fs = require("fs");
var dopromise = require("dopromise") 

dopromise.serial(
    function(done) {
        var that = this
        this.infile = process.argv[2] || ""
        fs.exists(this.infile, function (exists) {
            if (exists) {
                done()
            } else {
                console.log("File does not exist: " + that.infile)
            }
        })
    },
    function(done) {
        this.outfile = process.argv[3];
        if (this.outfile) {
            done()
        } else {
            console.log("Output File Name is Required")
        }
    },
    function(done) {
        var that = this
        fs.readFile(this.infile, function (err, data) {
            if (err) {
                console.log("Error reading File: " + that.infile)
            } else {
                that.contents = data
                done()
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
