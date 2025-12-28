// package.json 我想要什么
// package-lock.json 我实际用什么
// node_modules 真正的代码


// index.js
// 从node_modules/express里面加载Express框架
// require是Node.js的模块加载方式
// 没有这行就拿不到Express

const express = require("express");


// 创建一个应用实例（核心对象）
// 创建一个Express医用对象
// app就是你的服务器本体
// 后面的所有的：
    // 路由app.get/app.post
    // 中间件app.use
    // 监听端口app.listen
// 都是往这台服务器上加功能

const app = express();

// app.use()到底能接收什么？
    // 情况一：直接接收一个函数（最常见）
    // app.use((req, res, next) => {console.log("有人访问服务器"); next();});

    // 情况二：接收[路径 + 函数]
    // app.use("/api", (req, res, next) => {console.log("访问/api开头的路由");next();})

    // 情况三：接收Express内置中间件
    // app.use(express.json());
    // 这里非常重要的一点：
    // express.json()
    // 这是 “函数调用” 
    // 它返回一个middleware function，再交给app.use()

// 为什么Express要这样设计？
    // Express的核心思想是：
    // 请求 = 一条从从上到下执行的函数链
    // request
    // app.use(fn1)
    // app.use(fn2)
    // app.get("/xxx", handler)
    // response
    // next()的意义是：“我这个函数处理完了，交给下一个”
    // app.use用来 “拦路&预处理”
    // app.get/post用来“真正回答问题”
    // app.use((req, res, next) => { console.log(req.method, req.url); next();});
    // app.get("/hello", (req, res) => {res.send("hello")；})；

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Express server is running!");
});

app.post("/chat", (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "question is required" });
    };

    res.json({
        answer: `You asked: ${question}`,
    });
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// express终端和浏览器是怎么交互的？
// 浏览器和终端不是直接跟Express对话
// 它们都是通过HTTP请求，和Express这个服务器程序交互
// Express做的事情只有一句话：
// 监听端口，接收HTTP请求，返回HTTP响应

// 1. 浏览器（Browser）
// 负责发HTTP请求
// 负责展示HTTP响应
// 自动帮你发GET请求（）

// 2. 终端（Terminal）
// 你用curl/node/npm
// 手动发HTTP请求
// 更“原始、更真实”

// 3. Express（服务器）
// 一直在后台监听
// 等请求来
// 决定怎么回


// Express启动之后，到底发生了什么？
// app.listen(3000, () => {
//     console.log("Server running at http://localhost:3000");
// });
// Node进程向操作系统说：
// “我要占用3000端口， 所有发到这里的HTTP请求都交给我。”
// 此时状态是：
// Express server
// 监听localhost:3000
// 等待请求（idle）


// 浏览器是怎么和Express交互的？
// 你在浏览器输入：http://localhost:3000/
// 浏览器发送一个HTTP请求

// Express这边发生了什么？
// 请求进入Express
// 从上到下匹配中间件/路由
// 找到：
// app.get("/", (req, res) => {
//   res.send("Express server is running!");
// });
// Express返回相应：
    // HTTP/1.1 200 OK
    // 这一句话解释就是：
        // 服务器在告诉客户端：
        // “我用HTTP/1.1协议，成功处理了你的请求。一切正常。”
        // 它由三部分组成：
            // 协议版本 状态码 状态文本
    // Body
        // Express server is running!

// 那终端是怎么和Express交互的？
// 用curl(你自己“假装浏览器”)
    // curl http://localhost:3000/
    // curl 实际发的HTTP请求和浏览器几乎一摸一样
    // express处理流程完全想相同。
    // 唯一的区别是：
        // 浏览器：把响应渲染出来
        // 终端：把响应原样打印
        
