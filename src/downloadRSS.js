"use strict";
const path = require("path");
const request = require("request");
const fs = require("fs");

function downloadRSS(url, filename, callback) {
    //let stream = fs.createWriteStream(filename);
    let stream = fs.createWriteStream(path.join(__dirname, '../rss', filename));
    request(url).pipe(stream).on('close', callback);
}

module.exports = { downloadRSS }