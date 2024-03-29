"use strict";
const fs = require("fs");
const shell = require("shelljs");

let version = fs.readFileSync("results/runtime/version.txt", 'utf-8');

shell.cd("results/runtime/modules/edition");
fs.mkdir(version, (err) => {
    if (err) {
        if (err.code == "EEXIST") {
            return;
        }
        console.log(err);
        return false;
    }else{
        //fs.copyFileSync(__dirname+'/aria2c.conf', './results/runtime/modules/edition/download/aria2c.conf');
        console.log("Success.")
    }
});
fs.copyFileSync(__dirname+'/configs/aria2c.conf', './' + version + '/aria2c.conf');

shell.cd(version);
shell.exec("aria2c -i ../console.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../desktop.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../main.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../mobile.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../uwp.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../web.txt --conf-path=aria2c.conf");
shell.exec("aria2c -i ../comment.txt --conf-path=aria2c.conf");