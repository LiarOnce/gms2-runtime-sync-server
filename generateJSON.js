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
            ExportModule();
        });
    });
}

function ExportModule() {
    fs.access("./results/result.json", fs.constants.F_OK, function (err) {
        if (!err) {
            let GetItemVersion = JSON.parse(fs.readFileSync("./results/result.json")).rss.channel.item;
            fs.mkdirSync("./results/runtime");
            //Get comment and enclosure/
            let modulesJSON;
            if (GetItemVersion.length == undefined){
                modulesJSON = GetItemVersion;
            } else {
                modulesJSON = GetItemVersion[GetItemVersion.length - 1];
            }
            let comment = modulesJSON.comments;
            fs.writeFile("./results/runtime/comment.txt", comment, (err)=>{
                console.log("Get comment successfully.");
            });
            let enclosure = modulesJSON.enclosure.$.url;
            fs.writeFile("./results/runtime/enclosure.txt", enclosure, (err)=>{
                console.log("Get enclosure successfully.");
            });
            let version = modulesJSON.enclosure.$["sparkle:version"];
            fs.writeFile("./results/runtime/version.txt", version, (err)=>{
                console.log("Get version successfully.");
                checkRemoteVersion();
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
        } else {
            console.log(err);
        }
    });
}

function checkRemoteVersion() {
    let yoyoRemoteVersion = fs.readFileSync("./results/runtime/version.txt");
    let mirrorURL = config.mirrorURL + "/docs/version/version.txt";
    let mirrorVersion;
    downloadRSS.downloadRSSFromMirror(mirrorURL, "version-mirror.txt", function(){
        console.log("Download version from Mirror.");
        mirrorVersion = fs.readFileSync("./mirror/version-mirror.txt")
        if (yoyoRemoteVersion == mirrorVersion) {
            console.error("Runtime version is up-to-date, exiting......");
            process.exit(1); //If versions are same, exit.
        } else {
            return;
        }
    }); 
}

// Check RSS file exists, if file does not exists, download and convert to json
fs.access("./rss/" + RSS.RSSFile, fs.constants.F_OK, function (err) {
    if (err) {
        if (err.code === "ENOENT") {
            switch (config.channel) {
                case "Stable":
                    rssURL = "https://gms.yoyogames.com/Zeus-Runtime.rss";
                    rssPath = "Zeus-Runtime.rss";
                    break;

                case "NuBeta":
                    rssURL = "https://gms.yoyogames.com/Zeus-Runtime-NuBeta.rss";
                    rssPath = "Zeus-Runtime-NuBeta.rss";
                    break;
                    
                case "LTS":
                    rssURL = "https://gms.yoyogames.com/Zeus-Runtime-LTS.rss";
                    rssPath = "Zeus-Runtime-LTS.rss";
                    break;
                
                default:
                    console.log("No file.")
                    break;
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