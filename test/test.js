var async = require('async');
var readblock = require('../index');

var file = readblock.open('test.fasta');
var i = 0;
async.whilst(
    function() { return i < 110;},
    function(next) {
        i++;
        console.log("loading "+i+"th block");
        file.read("\n>", function(fasta) {
            console.log(fasta);
            next();
        });
    },
    function() {}
);
