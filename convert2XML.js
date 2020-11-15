"use strict";
const fs = require("fs");
const xml2js = require("xml2js");
const shell = require("shelljs");

const builder = new xml2js.Builder({
    rootName: "item"
});

let result3 = fs.readFileSync("./results/result3.json").toString();
let runtimeOriginalURL = "https://gm2016.yoyogames.com";
let runtimeMirrorURL = "https://gms.magecorn.com";
let final = result3.split(runtimeOriginalURL).join(runtimeMirrorURL);
fs.writeFile("./mirror/latest.json", final, (err) => {
    console.log("Change Mirror successfully.")
});

fs.access("./mirror/latest.json", fs.constants.F_OK, (err) => {
    let result = require("./results/result.json");
    let latest = "[" + JSON.parse(fs.readFileSync("./mirror/latest.json")) + "]";
    let resultAfter = result.rss.channel.item[result.rss.channel.item.length - 1];
    resultAfter.push(latest);
    fs.writeFile("./mirror/runtime.json", resultAfter, (err) => {
        console.log("Write JSON successfully.")
    });
});
//shell.cd("mirror");
//shell.exec("sed -i '1d' latest.xml");

//let latest = fs.readFileSync("latest.xml");
