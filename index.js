var fs = require('fs');
var async = require('async');

exports.open = function(path, opts) {
    var fd = fs.openSync(path, 'r');
    var buffer = new Buffer(8192); 
    var loading = ""; //partial content already loaded
    var eof = false;

    return {
        iseof: function() {
            return eof;
        },
        hasmore: function() {
            return !eof;
        },
        close: function() {
            fs.closeSync(fd);
        },
        read: function(delimiter, callback) {
            var cont = true;
            var ret = null;
            async.whilst(
                function() { return cont; },
                function(next) {
                    var dpos = loading.indexOf(delimiter);
                    if(dpos != -1) {
                        //found delimiter, so let's grab it
                        ret = loading.substring(0, dpos);
                        //put remaining back to loading
                        loading = loading.substring(dpos+1); //skip newline
                        cont = false;
                        next(null);
                    } else {
                        //we need to load more
                        fs.read(fd, buffer, 0, buffer.length, null, function(err, read, buffer) {
                            if(read == 0) {
                                //reached the end (flush the last block)
                                ret = loading;
                                loading = "";
                                eof = true;
                                cont = false;
                            } else {
                                //append new content
                                loading += buffer.toString('utf8', 0, read);
                                dpos = loading.indexOf(delimiter);
                                if(dpos != -1) {
                                    //found delimiter. grab it
                                    ret = loading.substring(0, dpos);
                                    //put remaining back to buffer
                                    loading = loading.substring(dpos+1); //skip newline
                                    cont = false;
                                }
                            }
                            next(null);
                        });
                    }
                },
                function(err) {
                    if(err) throw err;
                    callback(ret);
                }
            );
        }
    }
}

