"use strict";
const fs = require("fs");
const xml2js = require("xml2js");

const downloadRSS = require("./src/downloadRSS");
let config = require("./configs/config.json");
const shell = require("shelljs");

let rssURL, rssPath;

const builder = new xml2js.Builder({
    rootName: "item"
});

const parser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false
});

function download(){
    if (config.channel == "Stable") {
        rssURL = "https://gms.magecorn.com/Zeus-Runtime.rss";
        rssPath = "Zeus-Runtime.rss";
    } else {
        if (config.channel == "NuBeta") {
            rssURL = "https://gms.magecorn.com/Zeus-Runtime-NuBeta.rss";
            rssPath = "Zeus-Runtime-NuBeta.rss";
        } else {
            console.log("No file.")
        }
    }
    downloadRSS.downloadRSSFromMirror(rssURL, rssPath, function(){
        console.log("Download successfully from Mirror.");
        parseMirror();
    });
}

function parseMirror() {
    let xml = fs.readFileSync("./mirror/" + rssPath);
    parser.parseString(xml, function(err, result){
        let jsonmirror = JSON.stringify(result, null, "\t");
        fs.writeFile("./mirror/original.json", jsonmirror, (err)=>{
            console.log("Convert XML to JSON successfully.(Mirror)");
            initMirror();
        });
    });
}

function initMirror(){
    let latest = JSON.parse(fs.readFileSync("./mirror/latest.json"));
    let original = JSON.parse(fs.readFileSync("./mirror/original.json"));
    delete original.rss.channel.item[0];
    original.rss.channel.item.push(latest);
    let delete_original = JSON.stringify(original, null, "\t");
    fs.writeFile("./mirror/deleted.json", delete_original, (err)=>{
        console.log("Init to Mirror RSS successfully");
        generateXML();
    });
}

function generateXML () {
    fs.access("./mirror/deleted.json", fs.constants.F_OK, (err) => {
        let latest = fs.readFileSync("./mirror/deleted.json");
        let latestJSON = JSON.parse(latest);
        let xml = builder.buildObject(latestJSON);
        fs.writeFile("./mirror/latest.xml", xml, (err) => {
            console.log("Write XML successfully.");
            shell.cd("mirror");
            shell.exec("sed -i '2d' latest.xml");
            shell.exec("sed -i '$d' latest.xml");
        });
    });
};

let result3 = JSON.parse(fs.readFileSync("./results/result3.json"));
let result3String = fs.readFileSync("./results/result3.json").toString();
let runtimeOriginalURL = "https://gm2016.yoyogames.com";
let runtimeMirrorURL = config.mirrorURL + "/" + result3.enclosure.$['sparkle:version'];
let final = result3String.split(runtimeOriginalURL).join(runtimeMirrorURL);
fs.writeFile("./mirror/latest.json", final, (err) => {
    console.log("Change Mirror successfully.");
    download();
    //generateXML();
});

// fs.access("./mirror/latest.json", fs.constants.F_OK, (err) => {
//     let result = require("./results/result.json");
//     let latest = "[" + JSON.parse(fs.readFileSync("./mirror/latest.json")) + "]";
//     let resultAfter = result.rss.channel.item[result.rss.channel.item.length - 1];
//     resultAfter.push(latest);
//     fs.writeFile("./mirror/runtime.json", resultAfter, (err) => {
//         console.log("Write JSON successfully.")
//     });
// });
//shell.cd("mirror");
//shell.exec("sed -i '1d' latest.xml");

//let latest = fs.readFileSync("latest.xml");
