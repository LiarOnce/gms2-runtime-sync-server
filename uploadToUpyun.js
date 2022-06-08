"use strict";
const upyun = require("upyun");
const fs = require("fs");
let config = require("./configs/config.json");
const { type } = require("os");
const service = new upyun.Service(config.upyunService, config.upyunOperatorName, config.upyunOperatorPassword);
const client = new upyun.Client(service);
let version = fs.readFileSync("./results/runtime/version.txt", 'utf-8');

let RuntimeFiles = fs.readdirSync("./results/runtime/modules/edition/" + version);
client.makeDir("/" + config.channel + "/" + version);

RuntimeFiles.forEach((file) => {
    let runtimeRemoteFiles = "/" + config.channel + "/" + version + "/" + file;
    let runtimeLocalFiles = "./results/runtime/modules/edition/" + version + "/" + file;
    let readStream = fs.createReadStream(runtimeLocalFiles);
    client.putFile(runtimeRemoteFiles, readStream, {}).then(stream => {
        if (stream == true) {
            console.log("Upload " + file + " successfully.");
        }
    });
});

let RuntimeURLs = fs.readdirSync("./mirror/edition");
RuntimeURLs.forEach((file) => {
    let runtimeUrlRemoteFiles = "/docs/version/" + file;
    let runtimeUrlLocalFiles = "./mirror/edition/" + file;
    let readTxtStream = fs.createReadStream(runtimeUrlLocalFiles);
    client.putFile(runtimeUrlRemoteFiles, readTxtStream, {}).then(stream => {
        if (stream == true) {
            console.log("Upload URL " + file + " successfully.");
        }
    });
});

let MirrorZeusRuntimeRSS = fs.createReadStream("./mirror/Zeus-Runtime.rss");
client.putFile("/Zeus-Runtime.rss", MirrorZeusRuntimeRSS, {}).then(stream => {
    if (stream == true){
        console.log("Upload Zeus-Runtime.rss successfully.");
    }
});
