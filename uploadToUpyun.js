"use strict";
const upyun = require("upyun");
const fs = require("fs");
let config = require("./configs/config.json");
let channel = require("./configs/RSS.json");
const { type } = require("os");
const path = require("path");
const service = new upyun.Service(config.upyunService, config.upyunOperatorName, config.upyunOperatorPassword);
const client = new upyun.Client(service);
let version = fs.readFileSync("./results/runtime/version.txt", 'utf-8');

let RuntimeFiles = fs.readdirSync("./results/runtime/modules/edition/" + version).filter((ext) => {return ext.endsWith(".zip")});
client.makeDir("/" + config.channel + "/" + version);

RuntimeFiles.forEach((file) => {
    let runtimeRemoteFiles = "/" + config.channel + "/" + version + "/" + file;
    let runtimeLocalFiles = "./results/runtime/modules/edition/" + version + "/" + file;
    let readStream = fs.createReadStream(runtimeLocalFiles);
    if(fs.existsSync(runtimeLocalFiles + ".completed")){
        console.log(file + "Uploaded");
    } else {
        client.putFile(runtimeRemoteFiles, readStream, {}).then(stream => {
            if (stream == true) {
                fs.writeFileSync(runtimeLocalFiles + ".completed", "");
                console.log("Upload " + file + " successfully.");
            }
        });
    }
});

let ReleaseNotes = fs.readdirSync("./results/runtime/modules/edition/" + version).filter((ext) => {return ext.endsWith(".json")});
ReleaseNotes.forEach((file) => {
    client.putFile("/" + config.channel + "/" + version + "/" + file, ReleaseNotes, {}).then(stream => {
        if (stream == true){
            console.log("Upload Release Notes successfully.");
        }
    });
});

let RuntimeURLs = fs.readdirSync("./mirror/edition");
RuntimeURLs.forEach((file) => {
    let runtimeUrlRemoteFiles = "/docs/version/" + config.channel + "/" + file;
    let runtimeUrlLocalFiles = "./mirror/edition/" + file;
    let readTxtStream = fs.createReadStream(runtimeUrlLocalFiles);
    client.putFile(runtimeUrlRemoteFiles, readTxtStream, {}).then(stream => {
        if (stream == true) {
            console.log("Upload URL " + file + " successfully.");
        }
    });
});

let MirrorZeusRuntimeRSS = fs.createReadStream("./mirror/" + channel.RSSFile);
client.putFile("/" + channel.RSSFile, MirrorZeusRuntimeRSS, {}).then(stream => {
    if (stream == true){
        console.log("Upload Zeus-Runtime.rss successfully.");
    }
});
