
// var http = require("http");
// var fs = require("fs");
// var url = require("url");
// var port = process.argv[2];

// if (!port) {
//   console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
//   process.exit(1);
// }

// var server = http.createServer(function(request, response) {
//   var parsedUrl = url.parse(request.url, true);
//   var pathWithQuery = request.url;
//   var queryString = "";
//   if (pathWithQuery.indexOf("?") >= 0) {
//     queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
//   }
//   var path = parsedUrl.pathname;
//   var query = parsedUrl.query;
//   var method = request.method;

//   /******** 从这里开始看，上面不要看 ************/


//   const session = JSON.parse(fs.readFileSync('./session.json').toString())

//   console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

//   if (path === "/sign_in" && method === "POST") {
//     const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
//     const array = [];
//     request.on("data", chunk => {
//       array.push(chunk);
//     });
//     request.on("end", () => {
//       const string = Buffer.concat(array).toString();
//       const obj = JSON.parse(string); // name password
//       const user = userArray.find(
//         user => user.name === obj.name && user.password === obj.password
//       );
//       if (user === undefined) {
//         response.statusCode = 400;
//         response.setHeader("Content-Type", "text/json; charset=utf-8");
//       } else {
//         response.statusCode = 200;
//         const random = Math.random()
//         session[random] = {user_id: user.id}
//         fs.writeFileSync('./session.json', JSON.stringify(session))
//         response.setHeader("Set-Cookie", `session_id=${random}; HttpOnly`);
//       }
//       response.end()
//     });
//   } else if (path === "/home.html") {
//     // 写不出来  
//     //读取cookie  看nodejs中文文档
//     const cookie = request.headers["cookie"];
//     let sessionId;
//     try {
//       sessionId = cookie
//         .split(";")
//         .filter(s => s.indexOf("session_id=") >= 0)[0]
//         .split("=")[1];
//     } catch (error) {}
//     if (sessionId && session[sessionId]) {
//       const userId = session[sessionId].user_id
//       const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
//       const user = userArray.find(user => user.id === userId);
//       const homeHtml = fs.readFileSync("./public/home.html").toString();
//       let string = ''
//       if (user) {
//         string = homeHtml.replace("{{loginStatus}}", "已登录")
//           .replace('{{user.name}}', user.name)
//       }
//       response.write(string);
//     } else {
//       const homeHtml = fs.readFileSync("./public/home.html").toString();
//       const string = homeHtml.replace("{{loginStatus}}", "未登录")
//           .replace('{{user.name}}', '')
//       response.write(string);
//     }
//     response.end()
//   } else if (path === "/register" && method === "POST") {
//     response.setHeader("Content-Type", "text/html; charset=utf-8");
//     //response.end('很好！')  end一定要是时间的最后，因为是异步，系统会先执行end。。。记得给他注释掉 不然会报错！！！！！！！！  end后就结束了，不能够继续write了！
//     //现在想拿到用户的数据，在数据库里新增一行
//     //因为用户可能是分段上传的，所以我们在获取数据的时候要一点一点获取，使用数组！要监听请求

//     //读数据库
//     const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
//     const array = [];
//     request.on("data", chunk => {
//       array.push(chunk);
//     });
//     request.on("end", () => {
//       const string = Buffer.concat(array).toString();
//       const obj = JSON.parse(string);


//       //这个时候服务器就获取到了我们的name和密码，现在得存到数据库里去，先读数据库再写数据库，关于id,就读最后一个人id+1,  记得要防止数据库为空的情况！！  //注意：即使使用空的json文件 ，也得在里面加个[]
//       const lastUser = userArray[userArray.length - 1];
//       const newUser = {
//         // id 为最后一个用户的 id + 1
//         id: lastUser ? lastUser.id + 1 : 1,
//         name: obj.name,
//         password: obj.password
//       };
//       userArray.push(newUser);
//       fs.writeFileSync("./db/users.json", JSON.stringify(userArray));
//       response.end()
//     });
//   } else {
//     response.statusCode = 200;
//     // 默认首页
//     const filePath = path === "/" ? "/index.html" : path;
//     const index = filePath.lastIndexOf(".");
//     // console.log(index);  输入index.html的时候打印出来的值是6，确实,从i开始数， .就是第六个
//     //找到文件的后缀
//     // suffix 是后缀
//     const suffix = filePath.substring(index);
//     // console.log(suffix);  尝试了几个打出来的都是对的
//     // 使用哈希表 给他一一映射出来：key value, hash[xxx]:xxx就是key，通过key找value。 哈希表的设计初衷就是通过键key来查找值value的，可以说对哈希表的操作内部机制实质上都是对键的操作。键不能为空且唯一，value值可以。键、值可以为任意数据类型。
//     const fileTypes = {
//       ".html": "text/html",
//       ".css": "text/css",
//       ".js": "text/javascript",
//       ".png": "image/png",
//       ".jpg": "image/jpeg"
//     };
//     response.setHeader(
//       "Content-Type",
//       `${fileTypes[suffix] || "text/html"};charset=utf-8`
//     );
//     let content;
//     try {
//       content = fs.readFileSync(`./public${filePath}`);
//     } catch (error) {
//       content = "文件不存在";
//       response.statusCode = 404;
//     }
//     response.write(content);
//     response.end();
//   }

//   /******** 代码结束，下面不要看 ************/
// });

// server.listen(port);
// console.log(
//   "监听 " +
//     port +
//     " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
//     port
// );





var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/
  const session = JSON.parse(fs.readFileSync('./session.json').toString())

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  if (path === "/sign_in" && method === "POST") {
    const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
    const array = [];
    request.on("data", chunk => {
      array.push(chunk);
    });
    request.on("end", () => {
      const string = Buffer.concat(array).toString();
      const obj = JSON.parse(string); // name password
      const user = userArray.find(
        user => user.name === obj.name && user.password === obj.password
      );
      if (user === undefined) {
        response.statusCode = 400;
        response.setHeader("Content-Type", "text/json; charset=utf-8");
      } else {
        response.statusCode = 200;
        const random = Math.random()
        session[random] = {user_id: user.id}
        fs.writeFileSync('./session.json', JSON.stringify(session))
        response.setHeader("Set-Cookie", `session_id=${random}; HttpOnly`);
      }
      response.end()
    });
  } else if (path === "/home.html") {
    // 写不出来
    const cookie = request.headers["cookie"];
    let sessionId;
    try {
      sessionId = cookie
        .split(";")
        .filter(s => s.indexOf("session_id=") >= 0)[0]
        .split("=")[1];
    } catch (error) {}
    if (sessionId && session[sessionId]) {
      const userId = session[sessionId].user_id
      const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
      const user = userArray.find(user => user.id === userId);
      const homeHtml = fs.readFileSync("./public/home.html").toString();
      let string = ''
      if (user) {
        string = homeHtml.replace("{{loginStatus}}", "已登录")
          .replace('{{user.name}}', user.name)
      }
      response.write(string);
    } else {
      const homeHtml = fs.readFileSync("./public/home.html").toString();
      const string = homeHtml.replace("{{loginStatus}}", "未登录")
          .replace('{{user.name}}', '')
      response.write(string);
    }
    response.end()
  } else if (path === "/register" && method === "POST") {
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    const userArray = JSON.parse(fs.readFileSync("./db/users.json"));
    const array = [];
    request.on("data", chunk => {
      array.push(chunk);
    });
    request.on("end", () => {
      const string = Buffer.concat(array).toString();
      const obj = JSON.parse(string);
      const lastUser = userArray[userArray.length - 1];
      const newUser = {
        // id 为最后一个用户的 id + 1
        id: lastUser ? lastUser.id + 1 : 1,
        name: obj.name,
        password: obj.password
      };
      userArray.push(newUser);
      fs.writeFileSync("./db/users.json", JSON.stringify(userArray));
      response.end()
    });
  } else {
    response.statusCode = 200;
    // 默认首页
    const filePath = path === "/" ? "/index.html" : path;
    const index = filePath.lastIndexOf(".");
    // suffix 是后缀
    const suffix = filePath.substring(index);
    const fileTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "text/javascript",
      ".png": "image/png",
      ".jpg": "image/jpeg"
    };
    response.setHeader(
      "Content-Type",
      `${fileTypes[suffix] || "text/html"};charset=utf-8`
    );
    let content;
    try {
      content = fs.readFileSync(`./public${filePath}`);
    } catch (error) {
      content = "文件不存在";
      response.statusCode = 404;
    }
    response.write(content);
    response.end();
  }

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);