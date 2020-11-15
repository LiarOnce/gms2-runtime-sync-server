const fs = require("fs");

let result3JSON = fs.readFileSync("./results/result3.json");
let modulesJSON = JSON.parse(result3JSON);
let comment = modulesJSON.comments;

fs.writeFile("./results/runtime/modules/edition/comment.txt", comment, (err)=>{
    console.log("Get comment successfully.");
});