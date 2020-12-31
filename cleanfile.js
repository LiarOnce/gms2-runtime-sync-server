"use strict";
const fs = require("fs");
const shell = require("shelljs");

if (fs.access("./result/",fs.constants.F_OK, function(err) {
    shell.exec("rm -rf ./results/*");
    shell.exec("rm -rf ./rss/*");
    shell.exec("rm -rf ./mirror/*");
}));
