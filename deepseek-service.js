const DEFAULT_MODEL = "deepseek-chat";

const XINJIANG_KAZAKH_ORTHOGRAPHY =
  "Use China Xinjiang Kazakh Arabic script only. Important letters and sounds: " +
  "ا [ɑ], ە [e], ى [ɯ], ي [i], ۋ [u/w], ۆ [o], ۇ [ʊ], ې [æ], ۈ [y], " +
  "ب [b], پ [p], ت [t], د [d], چ [tʃ], ج [dʒ], خ [χ], ح [h], ق [q], ك [k], گ [g], " +
  "ف [f], ل [l], م [m], ن [n], ڭ [ŋ], ر [r], س [s], ز [z], ش [ʃ], ژ [ʒ], ھ [h], ء [ʔ]. " +
  "Do not output Uyghur words, random Arabic/Persian words, mojibake, or Cyrillic unless the user explicitly selects Cyrillic.";

async function handleDeepSeekRequest(body = {}, env = process.env) {
  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey.includes("在这里填写")) {
    return {
      status: 400,
      body: { error: "请先配置 DEEPSEEK_API_KEY 环境变量。" }
    };
  }

  const type = body.type === "translate" ? "translate" : "chat";
  const script = body.script === "cyrillic" ? "cyrillic" : "arabic";
  const messages =
    type === "translate"
      ? buildTranslationMessages(body, script)
      : buildChatMessages(body.messages, script);

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || DEFAULT_MODEL,
      messages,
      stream: false,
      temperature: type === "translate" ? 0.1 : 0.35,
      max_tokens: 1600
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      status: response.status,
      body: {
        error:
          (data.error && data.error.message) ||
          `DeepSeek 请求失败，HTTP ${response.status}`
      }
    };
  }

  const reply = data.choices?.[0]?.message?.content;
  if (!reply) {
    return {
      status: 502,
      body: { error: "DeepSeek 没有返回有效内容。" }
    };
  }

  return {
    status: 200,
    body: { reply: reply.trim() }
  };
}

function buildChatMessages(history = [], script) {
  const scriptInstruction =
    script === "arabic"
      ? XINJIANG_KAZAKH_ORTHOGRAPHY
      : "Use standard Kazakh Cyrillic. Do not mix Arabic-script Kazakh unless the user asks.";
  const cleanHistory = Array.isArray(history)
    ? history
        .filter(
          (item) =>
            item &&
            (item.role === "user" || item.role === "assistant") &&
            item.content
        )
        .slice(-10)
        .map((item) => ({
          role: item.role,
          content: String(item.content).slice(0, 1400)
        }))
    : [];

  return [
    {
      role: "system",
      content:
        "You are a warm Kazakh-Chinese bilingual assistant for daily communication in Xinjiang. " +
        "Use fluent, natural Simplified Chinese and accurate Kazakh. " +
        `${scriptInstruction} ` +
        "Always reply in this structure:\n中文：...\n\nقازاقشا：...\n" +
        "Keep the answer practical, short, and easy for ordinary users to understand."
    },
    ...cleanHistory
  ];
}

function buildTranslationMessages(body, script) {
  const text = String(body.text || "").trim().slice(0, 2200);
  if (!text) {
    throw new Error("请输入要翻译的内容。");
  }

  const toChinese = body.direction === "kk2zh";
  const target = toChinese
    ? "fluent Simplified Chinese"
    : script === "arabic"
      ? "China Xinjiang Kazakh Arabic script"
      : "standard Kazakh Cyrillic";
  const source = toChinese ? "Kazakh" : "Simplified Chinese";
  const scriptInstruction =
    !toChinese && script === "arabic"
      ? XINJIANG_KAZAKH_ORTHOGRAPHY
      : "";

  return [
    {
      role: "system",
      content:
        "You are a careful Chinese-Kazakh translator for daily life, clinics, schools, public services, shopping, transport, and family communication. " +
        "Translate meaning, not word-by-word. Make the result natural, polite, and easy to speak aloud. " +
        "Do not add explanations, labels, quotation marks, pinyin, or extra alternatives. Return only the final translation. " +
        scriptInstruction
    },
    {
      role: "user",
      content: `Translate from ${source} to ${target}:\n${text}`
    }
  ];
}

module.exports = {
  handleDeepSeekRequest
};
