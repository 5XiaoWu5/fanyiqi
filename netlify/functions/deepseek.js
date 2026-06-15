const { handleDeepSeekRequest } = require("../../deepseek-service");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders()
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "只支持 POST 请求。" });
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const result = await handleDeepSeekRequest(body);
    return jsonResponse(result.status, result.body);
  } catch (error) {
    return jsonResponse(500, {
      error: error.message || "服务器请求失败。"
    });
  }
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(body)
  };
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}
