$(() => {
    const send = $('#send')
    const show = $('#show')
    const fromSend = $('#send-con form')
    // console.log(send, fromSend);
    // 验证和过滤xss 的
    function filtr(val) {
        let temp = undefined
        if (val.length > 0) {
            temp = $(`<div>${val}</div>`)
        }
        return temp && temp.text()
    }

    // show.append(tag)
    // temp.remove()
    // 发送数据到服务器函数,需要传入上下文环境call等方法调用避免直接调用
    function send_fn(val) {
        val = filtr(val)
        // console.log(val, "===");

        if (val) {
            this.emit('data_A', val);
        }

    }
    // 随机rgb 还三行代码重复,懒得去改了
    function torgb() {
        let r = Math.floor(Math.random() * 255)
        let b = Math.floor(Math.random() * 255)
        let g = Math.floor(Math.random() * 255)
        return `#${r.toString(16)}${b.toString(16)}${g.toString(16)}`
    }
    // console.log(torgb());
    // 接收服务器发送的数据
    function accept_fn(data) {
        // console.log(data, "1");
        data = filtr(data)
        // 将数据添加到页面
        addDomShow(data)
    }
    // 添加数据到页面函数
    function addDomShow(data) {
        // 获取随机高度,按比例来的40:1
        let height = (Math.floor(parseInt($("#app").css('height'))-200) / 40)
        
        if (data) {

            let pTag = $(`<p class="run">${data}</p>`)

            show.append(pTag)

            pTag.css('color', torgb());
            // 动画,按自己需求改吧
            pTag.animate({
                left: `-${parseInt(pTag.css('width')) + 30}px`,
                color: torgb(),
                top: `${(Math.floor(Math.random() * height)) * 40 + 20 }px`
            }, (Math.floor(Math.random() * 20) + 20) * 1000, () => {
                pTag.remove()
            })
        }
    }
    // 连接服务器
    const socket = io();
    if (socket) {
        // console.log("连接成功")
        socket.on('data_B', accept_fn)
    }
    // 当连接到服务器之后在注册表单
    fromSend.submit(function (event) {
        event.preventDefault();
        if (socket) {
            send_fn.call(socket, send.val());
        }
        send.val('');
        return false;
    });
});