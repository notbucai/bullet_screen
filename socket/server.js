"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var koa_1 = __importDefault(require("koa"));
var socket_io_1 = __importDefault(require("socket.io"));
var fs_1 = __importDefault(require("fs"));
var koa_static_1 = __importDefault(require("koa-static"));
var path_1 = __importDefault(require("path"));
var app = new koa_1.default();
var RUN_DIR = process.cwd();
var conNum = 0;
var inSum = 0;
// const main: (ctx: Koa.Context) => void = (ctx: Koa.Context): void => {
//     ctx.response.type = "text/html"
//     ctx.response.body = fs.createReadStream(path.join(__dirname) + "/1.html")
// }
// app.use(KoaRoute.get('/', main))
// 这里配置网站根目录
var config;
console.log(__dirname + "/../config.json");
try {
    var configFile = fs_1.default.readFileSync(__dirname + "/../config.json");
    config = JSON.parse(configFile.toString());
}
catch (error) {
    loginfo("读取配置JSON出现错误");
}
var wwwroot = config && config.wwwroot || "/root/wwwroot/";
loginfo("\u5F53\u524Dwwwroot\u4E3A\uFF1A" + wwwroot);
// process.exit();
var serve = koa_static_1.default(path_1.default.join(wwwroot));
app.use(serve);
var server = http_1.default.createServer(app.callback()).listen(80, function () {
    loginfo("启动成功");
});
var io = socket_io_1.default.listen(server);
io.on("connection", function (socket) {
    loginfo("\u7B2C " + (++conNum) + " \u4E2A\u7528\u6237\u8BBF\u95EE");
    inSum++;
    sendMsg("", inSum);
    socket.on("disconnect", function () {
        loginfo("断开");
        // conNum--;
        inSum--;
    });
    socket.on("data_A", function (data) {
        loginfo(data);
        sendMsg(data, inSum);
    });
});
function sendMsg(data, inSum) {
    var dataZ = {
        data: data,
        inSum: inSum
    };
    io.emit("data_B", dataZ);
}
function loginfo(msg) {
    var date = (new Date()).toString();
    var info = date + " - " + msg;
    console.log(info);
}
