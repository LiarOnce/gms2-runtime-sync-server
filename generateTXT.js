"use strict";
const fs = require("fs");
const shell = require("shelljs");

shell.cd("results/runtime/modules");
fs.mkdir("edition", (err) => {
    if (err) {
        if (err.code == "EEXIST") {
            return;
        }
        console.log(err);
        return false;
    }else{
        console.log("Success.")
    }
});
fs.copyFileSync(__dirname + "/results/runtime/comment.txt", __dirname + "/results/runtime/modules/edition/comment.txt");
shell.exec("awk 1 ../enclosure.txt windows.txt operagx.txt operagxYYC.txt > edition/main.txt");
shell.exec("awk 1 linux.txt linuxYYC.txt mac.txt macYYC.txt windowsYYC.txt > edition/desktop.txt");
shell.exec("awk 1 html5.txt > edition/web.txt");
shell.exec("awk 1 android.txt ios.txt tvos.txt > edition/mobile.txt");
shell.exec("awk 1 windowsuap.txt > edition/uwp.txt");
shell.exec("awk 1 ps4.txt ps5.txt switch.txt xboxone.txt xboxseriesxs.txt > edition/console.txt"); 