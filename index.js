const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// 解析 JSON 请求体
app.use(express.json());

// 启动时候加载知识库
const knowledgePath = path.join(__dirname, "knowledge.txt");
const knowledgeText = fs.readFileSync(knowledgePath, "utf-8");
const knowledgeChunks = knowledgeText.split("\n").filter(Boolean);

// 测试用根路由
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// RAG核心接口
app.post("/chat", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required"});
  }

  // .find()在干嘛？
  // 从数组里一个一个拿出来，找到第一个让这个函数返回true的元素
  const hit = knowledgeChunks.find(chunk =>
  chunk.toLowerCase().includes(question.toLowerCase())
  );

  res.json({
    answer: hit || "No relevant knowledge found.",
    source: hit ? "knowledge.txt" : null,
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});