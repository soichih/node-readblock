readblock
============
Read big files, block by block

```
npm install readblock
```

##Usage
This modules can read a large file block by block, really fast, and by specified delimiter asynchronously.

For example...
```
var readblock = require('../index');
var file = readblock.open('test.fasta');
file.read("\n>", function(fasta) {
    console.dir(fasta);
});
```

readblock doesn't stream/flow like many other similar modules. It reads one block at a time (although buffered to about 8k), 
asynchrnously, so you can use it as part of async.whilst. In theory, readblock should be able to read files with any
size, and really fast.

```
var async = require('async');
var readblock = require('../index');

var file = readblock.open('test.fasta');
var i = 0;
async.whilst(
    function() { return i < 10;},
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
```

Output

```
loading 1th block
>Neff_comp582_c0_seq1 len=294 path=[1:0-293]
AAGGTTGTGATTTGATGTAATGTAAAAAAATGTTTCTTTTGCATCAACAAAAGCGCGCGA
AACTGATTACTGGGCTCAGTTGTCGGTGTCGAGGCGGAACTTCTTGGAGCGGATGGAGGT
AGACTCCTTGTGGCGCGTGAAGGGCTCGGCCTTGCGCTTTCGTCGCTCGGCGTCCTTCTT
GTGCTTGCGCTGCTTCTTGCGGGCCATGGCCTCGGGATTGACCACGGCCTGCACCGCCAG
CTGTCGCTTGCGCGAGAGCCGCGTCTGCGCGACATGCGAGCGCACCTGCGAGTG
loading 2th block
>Neff_comp709_c0_seq1 len=210 path=[1:0-209]
CGTGTGTGTCATGTGTGTCGCGAAGGCAGGGATGGCGTTGGTGTCGGTGAACGAGGTCAT
CGAAGCGATCGCGGAGGACATCAAGGAGAAGCTGCGGAAGGCGGTGGTCGGGGTCAGGGA
GGAGATGAAGCCGGTCCTGTACAGTGCGGAGGCCGACCGCGGCGAAGGAGAGATCGATGA
CGACGACGACCAAGAGGACGAGGGGCTGGG
loading 3th block
>Neff_comp572_c0_seq1 len=221 path=[199:0-220]
GCAGCAGAAGCGGAGGAAGGAGACCTTCACGGGCTTCTTCCGACGGCGACTCGACAGCGG
CGGCTCCTCCCCAGAGACACCGGTGTCGGCCATCGCCGCCAAGGCCGCCGAAGACATTGC
TGAGTAGCATAGTTCTACTTGAAGATGAGGATGAAGATGATGAAGACGGAGAAGAAGTAG
AAGAGTTTTGCAAGCACCGTGGAAGGAGGGTGATAGAGAGA
...
```

