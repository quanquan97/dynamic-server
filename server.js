var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\nnode server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
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

  console.log("有个傻子发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  response.statusCode = 200;

  //默认首页,nmd!! 刚才在这里又少写了一个/ 又花了我20分钟 TnT
  const filePath = path === "/" ? "/index.html" : path;
  const index = filePath.lastIndexOf(".");
  // console.log(index);  输入index.html的时候打印出来的值是6，确实,从i开始数， .就是第六个
  //找到文件的后缀
  const suffix = filePath.substring(index);
  // console.log(suffix);  尝试了几个打出来的都是对的

  // 使用哈希表 给他一一映射出来：key value, hash[xxx]:xxx就是key，通过key找value。 哈希表的设计初衷就是通过键key来查找值value的，可以说对哈希表的操作内部机制实质上都是对键的操作。键不能为空且唯一，value值可以。键、值可以为任意数据类型。
  const fileTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
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

  //刚才这里打错了又看了半天。。。打成了/public/${x}
  //这样会有个BUG 一旦在网址里面手残输入了错误的网址（比如我），服务器就挂了，就得重启服务器。。所以我们这里进行一次try catch操作，尝试....如果有错误 就抓住这个错误
  response.write(content);
  response.end();

  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
