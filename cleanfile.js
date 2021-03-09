"use strict";
const { constants } = require("buffer");
const fs = require("fs");
const shell = require("shelljs");

fs.access("./results/", fs.constants.F_OK, (err)=>{
    shell.exec("rm -rf ./results/*");
    shell.exec("rm -rf ./rss/*");
    console.log("Clean RSS cache successfully.");
});

fs.access("./mirror/", fs.constants.F_OK, (err)=>{
    shell.exec("rm -rf ./mirror/*");
    console.log("Clean RSS Mirror cache successfully.");
});