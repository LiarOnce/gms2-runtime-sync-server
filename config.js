"use strict";
const fs = require("fs");

let config = require("./configs/config.json");
let RSS = require("./configs/RSS.json");
let argChannel = process.argv.splice(2)[0];

switch (argChannel) {
    case "Stable":
        config["channel"] = "Stable";
        RSS["RSSFile"] = "Zeus-Runtime.rss"
        console.log("Channel is Stable.");
        break;

    case "NuBeta":
        config["channel"] = "NuBeta";
        RSS["RSSFile"] = "Zeus-Runtime-NuBeta.rss"
        console.log("Channel is NuBeta");
        break;

    case "LTS":
        config["channel"] = "LTS";
        RSS["RSSFile"] = "Zeus-Runtime-LTS.rss"
        console.log("Channel is LTS");
        break;

    default:
        break;
}

fs.writeFileSync("./configs/config.json", JSON.stringify(config, null, "\t"));
fs.writeFileSync("./configs/RSS.json", JSON.stringify(RSS));