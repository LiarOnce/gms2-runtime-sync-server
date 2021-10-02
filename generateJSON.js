"use strict";
// Init config
let config = require("./configs/config.json");
let RSS = require("./configs/RSS.json");

// Init dependencies
const fs = require("fs");
const xml2js = require("xml2js");
const shell = require("shelljs");

const downloadRSS = require("./src/downloadRSS");

let rssURL, rssPath;
// Init xml2js Parser
const xmlParser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false
});

// RSS download function.


// Parse downloaded RSS file.(XML)
function parseRSS() {
    let xml = fs.readFileSync("./rss/" + rssPath);
    xmlParser.parseString(xml, function (err, result) {
        let jsonresult = JSON.stringify(result, null, "\t");
        fs.writeFile("./results/result.json", jsonresult, (err) => {
            console.log("Convert XML to JSON successfully.")
            GetLatestVersionFromRSS();
        });
    });
}

function ExportModule() {
    fs.access("./results/latestversion.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let LatestVersion = fs.readFileSync("./results/latestversion.json");
            fs.mkdirSync("./results/runtime");
            //Get comment and enclosure/
            let modulesJSON = JSON.parse(LatestVersion);
            let comment = modulesJSON.comments;
            fs.writeFile("./results/runtime/comment.txt", comment, (err)=>{
                console.log("Get comment successfully.");
            });
            let enclosure = modulesJSON.enclosure.$.url;
            fs.writeFile("./results/runtime/modules/enclosure.txt", enclosure, (err)=>{
                console.log("Get enclosure successfully.");
            });
            let version = modulesJSON.enclosure.$["sparkle:version"];
            fs.writeFile("./results/runtime/version.txt", version, (err)=>{
                console.log("Get version successfully.")
            });
            //Get modules
            fs.mkdirSync("./results/runtime/modules");

            let moduleArray = modulesJSON.enclosure.module;
            for(let s in moduleArray){
                let name = moduleArray[s].$.name;
                let url = moduleArray[s].$.url;
                fs.writeFile("./results/runtime/modules/" + name + ".txt", url, (err)=>{
                    console.log("Get " + name + " successfully.")
                });
            }

            //Sort editions
            fs.mkdirSync("./results/runtime/modules/edition");
            shell.exec("awk 1 enclosure.txt windows.txt operagx.txt > edition/main.txt");
            shell.exec("awk 1 linux.txt linuxYYC.txt mac.txt macYYC.txt windowsYYC.txt > edition/desktop.txt");
            shell.exec("awk 1 html5.txt > edition/web.txt");
            shell.exec("awk 1 android.txt ios.txt tvos.txt > edition/mobile.txt");
            shell.exec("awk 1 windowsuap.txt > edition/uwp.txt");
            shell.exec("awk 1 ps4.txt ps5.txt switch.txt xboxone.txt xboxseriesxs.txt > edition/console.txt"); 
        } else {
            console.log(err);
        }
    });
}

function GetLatestVersionFromRSS() {
    fs.access("./results/result.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let resultJSON = fs.readFileSync("./results/result.json");
            let rssJSON = JSON.parse(resultJSON);
            let exportMinimal = JSON.stringify(rssJSON.rss.channel.item[rssJSON.rss.channel.item.length - 1], null, "\t");
            fs.writeFile("./results/latestversion.json", exportMinimal, (err) => {
                console.log("Export the latest version from JSON successfully.");
                ExportModule();
            });
        } else {
            console.log(err);
        }
    });
}



// Check RSS file exists, if file does not exists, download and convert to json
fs.access("./rss/" + RSS.RSSFile, fs.constants.F_OK, function (err) {
    if (err) {
        if (err.code === "ENOENT") {
            if (config.channel == "Stable") {
                rssURL = "https://gms.yoyogames.com/Zeus-Runtime.rss";
                rssPath = "Zeus-Runtime.rss";
            } else {
                if (config.channel == "NuBeta") {
                    rssURL = "https://gms.yoyogames.com/Zeus-Runtime-NuBeta.rss";
                    rssPath = "Zeus-Runtime-NuBeta.rss";
                } else {
                    console.log("No file.")
                }
            }
            downloadRSS.downloadRSS(rssURL, rssPath, function () {
                console.log("Download successfully. \nIf you want to change channel, you need run 'npm run clean' to delete generated files.")
                console.log("And change 'channel' in 'configs/config.json', you also need to run 'npm run config' to take effect.\n")
                parseRSS();
            });
        }
    } else {
        return;
    }
});