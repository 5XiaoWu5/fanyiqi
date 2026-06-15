const { handleDeepSeekRequest } = require("../deepseek-service");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "只支持 POST 请求。" });
    return;
  }

  try {
    const result = await handleDeepSeekRequest(req.body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({
      error: error.message || "服务器请求失败。"
    });
  }
};
