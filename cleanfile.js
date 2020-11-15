"use strict";
const fs = require("fs");
const shell = require("shelljs");

fs.unlinkSync("./rss/Zeus-Runtime-NuBeta.rss");
fs.unlinkSync("./results/result.json");
fs.unlinkSync("./results/result2.json");
fs.unlinkSync("./results/result3.json");
fs.unlinkSync("./results/runtime/modules.json");
shell.exec("rm -rf ./results/runtime/modules/*");