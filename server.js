const path = require("path");
const express = require("express");
require("dotenv").config();

const { handleDeepSeekRequest } = require("./deepseek-service");

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/deepseek", async (req, res) => {
  try {
    const result = await handleDeepSeekRequest(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({
      error: error.message || "服务器请求失败。"
    });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`哈萨克语 AI 网站已启动：http://localhost:${port}`);
});
