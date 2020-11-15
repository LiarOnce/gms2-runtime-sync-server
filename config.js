"use strict";
const fs = require("fs");

let config = require("./configs/config.json");

if (config.channel === "Stable") {
    global.runtime = {"RSSFile": "Zeus-Runtime.rss"};
    console.log("Channel is Stable.");
}else{
    if (config.channel === "NuBeta") {
        global.runtime = {"RSSFile": "Zeus-Runtime-NuBeta.rss"};
        console.log("Channel is NuBeta");
    }
}
let data = JSON.stringify(runtime);
fs.writeFileSync("./configs/RSS.json", data);