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
shell.exec("awk 1 enclosure.txt windows.txt > edition/main.txt");
shell.exec("awk 1 linux.txt linuxYYC.txt mac.txt macYYC.txt windowsYYC.txt > edition/desktop.txt");
shell.exec("awk 1 html5.txt > edition/web.txt");
shell.exec("awk 1 android.txt ios.txt tvos.txt > edition/mobile.txt");
shell.exec("awk 1 windowsuap.txt > edition/uwp.txt");
shell.exec("awk 1 ps4.txt switch.txt xboxone.txt > edition/console.txt");