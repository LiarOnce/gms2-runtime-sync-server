"use strict";
const fs = require("fs");
const requireDir = require("require-dir");
const dir = requireDir("./results/runtime/modules/", { extensions: ['.json'] });

//console.log(dir);
for(let s in dir){
    let item = dir[s].$.name;
    let url = dir[s].$.url;
    fs.writeFile("./results/runtime/modules/"+item+".txt", url, (err)=>{
        console.log("Get "+item+" successfully.");
    });
}