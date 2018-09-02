import http from 'http'
import Koa from 'koa'
import socketIo from 'socket.io'
import fs from 'fs'
import KoaStatic from 'koa-static'
import KoaRoute from 'koa-route'
import path from 'path'

const app = new Koa();
const RUN_DIR = process.cwd();
let conNum = 0

// const main: (ctx: Koa.Context) => void = (ctx: Koa.Context): void => {
//     ctx.response.type = "text/html"
//     ctx.response.body = fs.createReadStream(path.join(__dirname) + "/1.html")
// }

// app.use(KoaRoute.get('/', main))
// 这里配置网站根目录
const serve = KoaStatic(path.join("I:\\wwwroot"))

app.use(serve)

const server = http.createServer(app.callback()).listen(8564, () => {
    console.log("启动成功");
})

const io = socketIo.listen(server)

io.on("connection", socket => {

    console.log(`第 ${(++conNum)} 个用户访问`)
    socket.on("disconnect", () => {
        console.log("断开")
        // conNum--;
    })
    socket.on("data_A", (data) => {
        console.log(data);
        io.emit("data_B", data)
    })
})
