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
            minimalRSS();
        });
    });
}

function cutTheNewestVersion() {
    shell.cd("results");
    shell.exec("sed -i '1d' result2.json");
    shell.exec("sed -i '$d' result2.json");
    shell.exec("cat result2.json | tail -n 152 > result3.json");
    shell.cd("..");
}

function cutModule() {
    fs.access("./results/result3.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let result3JSON = fs.readFileSync("./results/result3.json");
            fs.mkdirSync("./results/runtime");
            //Get comment and enclosure
            let modulesJSON = JSON.parse(result3JSON);
            let comment = modulesJSON.comments;
            fs.writeFile("./results/runtime/comment.txt", comment, (err)=>{
                console.log("Get comment successfully.");
            });
            let enclosure = modulesJSON.enclosure.$.url;
            fs.writeFile("./results/runtime/enclosure.txt", enclosure, (err)=>{
                console.log("Get enclosure successfully.");
            });
            //Get modules
            fs.mkdirSync("./results/runtime/modules");
            
            //For Desktop
            let linux = modulesJSON.enclosure.module[3].$.url;
            fs.writeFile("./results/runtime/modules/linux.txt", linux, (err)=>{
                console.log("Get (Desktop) Linux modules successfully.");
            });
            let linuxYYC = modulesJSON.enclosure.module[4].$.url;
            fs.writeFile("./results/runtime/modules/linuxYYC.txt", linuxYYC, (err)=>{
                console.log("Get (Desktop) Linux (YoYo Compiler) modules successfully.");
            });
            let mac = modulesJSON.enclosure.module[5].$.url;
            fs.writeFile("./results/runtime/modules/mac.txt", mac, (err)=>{
                console.log("Get (Desktop) macOS modules successfully.");
            });
            let macYYC = modulesJSON.enclosure.module[6].$.url;
            fs.writeFile("./results/runtime/modules/macYYC.txt", macYYC, (err)=>{
                console.log("Get (Desktop) macOS (YoYo Compiler) modules successfully.");
            });
            let windows = modulesJSON.enclosure.module[10].$.url;
            fs.writeFile("./results/runtime/modules/windows.txt", windows, (err)=>{
                console.log("Get (Desktop) Windows modules successfully.");
            });
            let windowsYYC = modulesJSON.enclosure.module[12].$.url;
            fs.writeFile("./results/runtime/modules/windowsYYC.txt", windowsYYC, (err)=>{
                console.log("Get (Desktop) Windows (YoYo Compiler) modules successfully.");
            });

            //For Mobile
            let android = modulesJSON.enclosure.module[0].$.url;
            fs.writeFile("./results/runtime/modules/android.txt", android, (err)=>{
                console.log("Get (Mobile) Android modules successfully.");
            });
            let ios = modulesJSON.enclosure.module[2].$.url;
            fs.writeFile("./results/runtime/modules/ios.txt", ios, (err)=>{
                console.log("Get (Mobile) iOS modules successfully.");
            });
            let tvos = modulesJSON.enclosure.module[9].$.url;
            fs.writeFile("./results/runtime/modules/tvos.txt", tvos, (err)=>{
                console.log("Get (Mobile) tvOS module successfully.")
            });

            //For Web
            let html5 = modulesJSON.enclosure.module[1].$.url;
            fs.writeFile("./results/runtime/modules/html5.txt", html5, (err)=>{
                console.log("Get (Web) HTML5 modules successfully.");
            });
            
            //For UWP
            let windowsuap = modulesJSON.enclosure.module[11].$.url;
            fs.writeFile("./results/runtime/modules/windowsuap.txt", windowsuap, (err)=>{
                console.log("Get (UWP) Windows 10 UWP modules successfully.");
            });

            //For console
            let ps4 = modulesJSON.enclosure.module[7].$.url;
            fs.writeFile("./results/runtime/modules/ps4.txt", ps4, (err)=>{
                console.log("Get (Console) PlayStation 4 modules successfully.");
            });
            let nswitch = modulesJSON.enclosure.module[8].$.url;
            fs.writeFile("./results/runtime/modules/nswitch.txt", nswitch, (err)=>{
                console.log("Get (Console) Nintendo Switch modules successfully.");
            });
            let xboxone = modulesJSON.enclosure.module[13].$.url;
            fs.writeFile("./results/runtime/modules/xboxone.txt", xboxone, (err)=>{
                console.log("Get (Console) Xbox One modules successfully.");
            });
        } else {
            console.log(err);
        }
    });
}

function minimalRSS() {
    fs.access("./results/result.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let resultJSON = fs.readFileSync("./results/result.json");
            let rssJSON = JSON.parse(resultJSON);
            let exportMinimal = JSON.stringify(rssJSON.rss.channel.item, null, "\t");
            fs.writeFile("./results/result2.json", exportMinimal, (err) => {
                console.log("Minimal JSON successfully.");
                cutTheNewestVersion();
                console.log("Cut the latest version from JSON successfully.");
                cutModule();
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