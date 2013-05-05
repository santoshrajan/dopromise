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
            console.log('Build in ' + (new Date() - start) + 'ms')
        }
    }
)
