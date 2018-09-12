import http from 'http'
import Koa from 'koa'
import socketIo from 'socket.io'
import fs, { exists } from 'fs'
import KoaStatic from 'koa-static'
import KoaRoute from 'koa-route'
import path from 'path'

const app = new Koa();
const RUN_DIR = process.cwd();
let conNum = 0
let inSum = 0

// const main: (ctx: Koa.Context) => void = (ctx: Koa.Context): void => {
//     ctx.response.type = "text/html"
//     ctx.response.body = fs.createReadStream(path.join(__dirname) + "/1.html")
// }

// app.use(KoaRoute.get('/', main))
// 这里配置网站根目录
let config;
console.log(__dirname + "/../config.json")
try {
    const configFile = fs.readFileSync(__dirname + "/../config.json")
    config = JSON.parse(configFile.toString())

} catch (error) {
    loginfo("读取配置JSON出现错误")

}

const wwwroot = config && config.wwwroot || "/root/wwwroot/";
loginfo(`当前wwwroot为：${wwwroot}`)

// process.exit();
const serve = KoaStatic(path.join(wwwroot))

app.use(serve)

const server = http.createServer(app.callback()).listen(80, () => {
    loginfo("启动成功")
})

const io = socketIo.listen(server)


io.on("connection", socket => {

    loginfo(`第 ${(++conNum)} 个用户访问`);
    inSum++;
    sendMsg("", inSum)

    socket.on("disconnect", () => {
        loginfo("断开");
        // conNum--;
        inSum--;
    })
    socket.on("data_A", (data) => {

        loginfo(data);
        sendMsg(data, inSum)

    })
});

function sendMsg(data: string, inSum: number) {

    const dataZ = {
        data,
        inSum
    }

    io.emit("data_B", dataZ)
}

function loginfo(msg: string): void {
    const date = (new Date()).toString();

    const info = `${date} - ${msg}`
    console.log(info);

}
