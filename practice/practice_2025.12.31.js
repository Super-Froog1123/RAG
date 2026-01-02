// 在服务器启动时加载知识
// &这个是做什么的？这个是接口吗？从node_modules中引用的吗？
// 这个fs和path，相当于java.lang.String
// 这里相当于import引入
// 是Node.js内建模块（core module）
  // fs是做什么的？
  // fs = File System（文件系统）
  // 直接让Node去读你电脑硬盘上的文件

  // path是做什么的？为什么不能直接写字符串？
  // path做的事是让Node自动生成“当前系统下正确的路径”
  // 你可以把它理解成：
  // 路径拼接的“安全层”
const fs = require("fs");
const path = require("path");




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



// &为什么在app.use(express.json());下面加，app.use是中间件吗？
  // HTTP Request
  // express.json() 中间件
  // 你的路由 app.get / app.post
const knowledgePath = path.join(__dirname, "knowledge.txt");
const knowledgeText = fs.readFileSync(knowledgePath, "utf-8");

const knowledgeChunks = knowledgeText.spilt("\n").filter(Boolean);



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
  res.send("runnnnnnnning!🚀")
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
  
  // 简单规则：找到第一个包含关键词的知识
  const hit = knowledgeChunks.find(chunk => 
    chunk.toLowerCase().includes(question.toLowerCase())
  );

  res.json({
    answer: hit || "No relevant knowledge found.",
    source: hit ? "knowledge.txt" : null,
  });
});


// 端口
// 优先使用环境变量PORT（云平台会给）
// 本地没有，用3000
const PORT = process.env.PORT || 3000;


// 启动服务器
// 让Express开始监听端口
// 回调函数只是打印一行日志
// 这个打印是在terminal中的
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
