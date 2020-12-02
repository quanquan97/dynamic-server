//读数据库

const fs = require("fs");
const { type } = require("os");

const usersString = fs.readFileSync("./db/users.json").toString();

const usersArray = JSON.parse(usersString);

console.log(usersString);
console.log(typeof usersString);
console.log(usersArray);
console.log(typeof usersArray);
console.log(usersArray instanceof Array);

//写数据库  增加一个用户
const user4 = { "id":4,"name": "jack", "age": 12, "password": "zzz" };
usersArray.push(user4);

//还得存到数据库里去  我们的数据库是文件，文件只能存字符串，所以我们又得把数组变成字符串，然后写到文件里面去
const string = JSON.stringify(usersArray);
fs.writeFileSync("./db/users.json", string);
//在终端每次执行一次node-test.js json文件里就多一行数据