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