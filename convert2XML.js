"use strict";
const fs = require("fs");
const xml2js = require("xml2js");

const downloadRSS = require("./src/downloadRSS");
let config = require("./configs/config.json");
const shell = require("shelljs");

let GetLatestVersion = JSON.parse(fs.readFileSync("./results/result.json")).rss.channel.item;
let latestversion = GetLatestVersion[GetLatestVersion.length - 1];
let latestversionString = JSON.stringify(latestversion);
let runtimeOriginalURL = "http\:\/\/gms.yoyogames.com|https\:\/\/gms.yoyogames.com|http\:\/\/gm2016.yoyogames.com|http\:\/\/gm2016.yoyogames.com";
let runtimeMirrorURL = config.mirrorURL + "/" + config.channel + "/" + latestversion.enclosure.$['sparkle:version'];
let Reg = new RegExp(runtimeOriginalURL, "g");

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
        rssURL = config.mirrorURL + "/" + "Zeus-Runtime.rss";
        rssPath = "Zeus-Runtime.rss";
    } else {
        if (config.channel == "NuBeta") {
            rssURL = config.mirrorURL + "/" + "Zeus-Runtime-NuBeta.rss";
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
    original.rss.channel.item = original.rss.channel.item.filter(n => n);
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
            fs.unlinkSync("Zeus-Runtime.rss");
            fs.renameSync("latest.xml", "Zeus-Runtime.rss");
            CopyAndGenerateTXT();
        });
    });
};

function CopyAndGenerateTXT() {
    let modulesTXTArray = ["comment", "main", "desktop", "web", "mobile", "uwp", "console"];
    fs.mkdirSync( __dirname + "/mirror/edition");
    for (let i = 0; i < modulesTXTArray.length; i++) {
        let srcTXT = __dirname + "/results/runtime/modules/edition/" + modulesTXTArray[i] + ".txt";
        let destTXT = __dirname + "/mirror/edition/" + modulesTXTArray[i] + ".txt";
        fs.copyFileSync(srcTXT, destTXT);
        let mirrorTXT = fs.readFileSync(destTXT).toString();
        console.log(mirrorTXT);
        let final = mirrorTXT.replace(Reg, runtimeMirrorURL);
        fs.writeFile(destTXT, final, (err) => {
            console.log("Write mirror URL successfully.");
        });
    };
    fs.copyFileSync(__dirname + "/results/runtime/version.txt", __dirname + "/mirror/edition/version.txt");
};

let final = latestversionString.replace(Reg, runtimeMirrorURL);
fs.writeFile("./mirror/latest.json", final, (err) => {
    console.log("Change Mirror successfully.");
    download();
});