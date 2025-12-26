// package.json 我想要什么
// package-lock.json 我实际用了什么
// node_modules 真正的代码


// index.js
// 从node_modules/express里面加载Express框架
// require是Node.js的模块加载方式
// 没有这行就拿不到Express

const express = require("express");


// 创建一个应用实例（核心对象）
// 创建一个Express应用对象
// app就是你的服务器本体
// 后面所有的：
  // 路由app.get/app.post
  // 中间件app.use
  // 监听端口app.listen
// 都是往这台服务器上加功能

const app = express();


// 中间件：解析 JSON 请求体
// 在干什么？告诉Express：
  // 如果请求是JSON，请帮我自动解析
  // 把JSON内容放进req.body

app.use(express.json());

// 根路由（GET/）——“服务器还活着吗？”
// 测试用根路由
// 在干什么？
  // 定义一个HTTP GET接口
  // 路径是/
  // 浏览器访问http://localhost:3000/时触发
// req/res是什么？
  // req = request(请求)
  // res = response(响应)
  // 浏览器 -> req -> 服务器
  // 服务器 -> res -> 浏览器
// 这一段的意义
  // 用户来测试服务器是否正常启动
  // 相当于“心跳检测”
// 这是lambd风格的函数写法
  // 在JavaScript里面，正式的名字叫做：Arrow Function（箭头函数）
  // 为什么Express里面大量用这种写法？
  // 因为Express的API本质是：
    // 你给我一个函数，我在合适的时候帮你调用
    // app.get("/", (req, res) => {
    //  res.send("Express server is running!")
    // })
    // 意思是当有人访问 /, Express帮你调用这个匿名函数，并把req、res传进来

app.get("/", (req, res) => {
  res.send("Express server is running 🚀");
});


// 示例 API（以后可以替换成 RAG）
// Post/chat —— API核心入口（RAG）就从这里开始
// 在干什么？
// 定义一个POST接口，路径是/chat，用于接收“问题”
// 为什么用POST？
// 请求体里面有JSON
// 语义是“提交数据”，不是“拿页面”

app.post("/chat", (req, res) => {
  // 这是JavaScript的“对象解构赋值（Object Destructuring）”
  // 他的作用是：
  // 从req.body这个对象里，取出question这个字段，定义成一个同名变量
  // 过程：
  // 假设客户端发送过来的JSON是：
  // {
  //   "question": "What is RAG?",
  //   "user": "allen"
  // }
  // 在Express里，经过：
  // app.use(express.json())
  // 之后：
  // req.body === {
  //   question: "What is RAG?",
  //   user: "allen"
  // }
  // 那么这句代码：
  // const { question } = req.body;
  // 等价于：
  // const question = req.body.question;
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  res.json({
    answer: `You asked: ${question}`,
  });
});

// 端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
