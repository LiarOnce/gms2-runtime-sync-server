"use strict";
// Init dependencies
const fs = require("fs");
const xml2js = require("xml2js");
const shell = require("shelljs");

const downloadRSS = require("./src/downloadRSS");

let rssURL = "https://gms.yoyogames.com/update-manual.rss";
let rssPath = "update-manual.rss";
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
        fs.writeFile("./results/resultManual.json", jsonresult, (err) => {
            console.log("Convert XML to JSON successfully.")
            ExportModule();
        });
    });
}

function ExportModule() {
    fs.access("./results/resultManual.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let GetItemVersion = JSON.parse(fs.readFileSync("./results/resultManual.json")).rss.channel.item;
            fs.mkdirSync("./results/manual");
            //Get comment and enclosure/
            let enclosure = GetItemVersion.enclosure.$.url;
            fs.writeFile("./results/manual/enclosure.txt", enclosure, (err)=>{
                console.log("Get enclosure successfully.");
            });
            let version = GetItemVersion.enclosure.$["sparkle:version"];
            fs.writeFile("./results/manual/version.txt", version, (err)=>{
                console.log("Get version successfully.");
                // checkRemoteVersion();
                downloadManualZip();
            });
        } else {
            console.log(err);
        }
    });
}

function downloadManualZip() {
    shell.cd("results/manual");
    fs.copyFileSync(__dirname+'/configs/aria2c.conf', './aria2c.conf');
    shell.exec("aria2c -i enclosure.txt --conf-path=aria2c.conf");
}

// function checkRemoteVersion() {
//     let yoyoRemoteVersion = fs.readFileSync("./results/runtime/version.txt");
//     let mirrorURL = config.mirrorURL + "/docs/version/version.txt";
//     let mirrorVersion;
//     downloadRSS.downloadRSSFromMirror(mirrorURL, "version-mirror.txt", function(){
//         console.log("Download version from Mirror.");
//         mirrorVersion = fs.readFileSync("./mirror/version-mirror.txt")
//         if (yoyoRemoteVersion == mirrorVersion) {
//             console.error("Runtime version is up-to-date, exiting......");
//             process.exit(1); //If versions are same, exit.
//         } else {
//             return;
//         }
//     }); 
// }

// Check RSS file exists, if file does not exists, download and convert to json
fs.access(rssPath, fs.constants.F_OK, function (err) {
    if (err) {
        if (err.code === "ENOENT") {
            downloadRSS.downloadRSS(rssURL, rssPath, function () {
                console.log("Download manual RSS successfully.")
                parseRSS();
            });
        }
    } else {
        return;
    }
});