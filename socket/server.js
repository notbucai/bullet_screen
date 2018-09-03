"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var koa_1 = __importDefault(require("koa"));
var socket_io_1 = __importDefault(require("socket.io"));
var koa_static_1 = __importDefault(require("koa-static"));
var path_1 = __importDefault(require("path"));
var app = new koa_1.default();
var RUN_DIR = process.cwd();
var conNum = 0;
// const main: (ctx: Koa.Context) => void = (ctx: Koa.Context): void => {
//     ctx.response.type = "text/html"
//     ctx.response.body = fs.createReadStream(path.join(__dirname) + "/1.html")
// }
// app.use(KoaRoute.get('/', main))
// 这里配置网站根目录
var serve = koa_static_1.default(path_1.default.join("/root/bullet_screen/"));
app.use(serve);
var server = http_1.default.createServer(app.callback()).listen(80, function () {
    console.log("启动成功");
});
var io = socket_io_1.default.listen(server);
io.on("connection", function (socket) {
    console.log("\u7B2C " + (++conNum) + " \u4E2A\u7528\u6237\u8BBF\u95EE");
    socket.on("disconnect", function () {
        console.log("断开");
        // conNum--;
    });
    socket.on("data_A", function (data) {
        console.log(data);
        io.emit("data_B", data);
    });
});
