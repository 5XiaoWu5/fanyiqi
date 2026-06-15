const state = {
  mode: "chat",
  script: "arabic",
  direction: "zh2kk",
  loading: false,
  translating: false,
  voices: [],
  messages: [
    {
      role: "assistant",
      content:
        "你好，我可以帮你用中文和哈萨克语沟通。\n\nسەلەمەتسىز بە، مەن قازاقشا ۋە خەنزۇچە ئالاقە قىلىشقا ياردەم بېرەلەيمەن."
    }
  ]
};

const elements = {
  status: document.querySelector("#status"),
  scriptSelect: document.querySelector("#scriptSelect"),
  modeTabs: document.querySelectorAll(".mode-tab"),
  chatView: document.querySelector("#chatView"),
  translateView: document.querySelector("#translateView"),
  learnView: document.querySelector("#learnView"),
  messages: document.querySelector("#messages"),
  chatForm: document.querySelector("#chatForm"),
  chatInput: document.querySelector("#chatInput"),
  sendButton: document.querySelector("#sendButton"),
  directionButtons: document.querySelectorAll(".direction"),
  swapButton: document.querySelector("#swapButton"),
  translateInput: document.querySelector("#translateInput"),
  translateButton: document.querySelector("#translateButton"),
  translationResult: document.querySelector("#translationResult"),
  copyTranslate: document.querySelector("#copyTranslate"),
  speakSource: document.querySelector("#speakSource"),
  speakResult: document.querySelector("#speakResult"),
  stopSpeech: document.querySelector("#stopSpeech"),
  learnSearch: document.querySelector("#learnSearch"),
  randomCard: document.querySelector("#randomCard"),
  practiceCard: document.querySelector("#practiceCard"),
  learnSections: document.querySelector("#learnSections")
};

renderMessages();
renderLearningSections("");
loadVoices();

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

elements.scriptSelect.addEventListener("change", (event) => {
  state.script = event.target.value;
  setStatus("语言文字设置已更新");
});

elements.modeTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
  });
});

elements.chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await sendChat();
});

elements.directionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDirection(button.dataset.direction);
  });
});

elements.swapButton.addEventListener("click", () => {
  setDirection(state.direction === "zh2kk" ? "kk2zh" : "zh2kk");
});

elements.translateButton.addEventListener("click", translateText);
elements.copyTranslate.addEventListener("click", () => {
  copyText(elements.translationResult.textContent);
});
elements.speakSource.addEventListener("click", () => {
  speakText(elements.translateInput.value, sourceLanguage());
});
elements.speakResult.addEventListener("click", () => {
  speakText(elements.translationResult.textContent, targetLanguage());
});
elements.stopSpeech.addEventListener("click", stopSpeech);

elements.learnSearch.addEventListener("input", (event) => {
  renderLearningSections(event.target.value);
});

elements.randomCard.addEventListener("click", showRandomPractice);

function setMode(mode) {
  state.mode = mode;
  elements.modeTabs.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  elements.chatView.classList.toggle("hidden", mode !== "chat");
  elements.translateView.classList.toggle("hidden", mode !== "translate");
  elements.learnView.classList.toggle("hidden", mode !== "learn");
}

function setDirection(direction) {
  state.direction = direction;
  elements.directionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.direction === direction);
  });
  elements.translateInput.placeholder =
    direction === "zh2kk" ? "输入中文..." : "قازاقشا مەتەن كىرگۈزۈڭ...";
  elements.translationResult.textContent = "翻译后的内容会显示在这里。";
}

async function sendChat() {
  const text = elements.chatInput.value.trim();
  if (!text || state.loading) return;

  state.messages.push({ role: "user", content: text });
  elements.chatInput.value = "";
  renderMessages();
  setLoading(true);
  setStatus("正在生成双语回复...");

  try {
    const data = await requestDeepSeek({
      type: "chat",
      script: state.script,
      messages: state.messages.slice(-10)
    });
    state.messages.push({ role: "assistant", content: data.reply });
    renderMessages();
    setStatus("回复完成");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setLoading(false);
  }
}

async function translateText() {
  const text = elements.translateInput.value.trim();
  if (!text || state.translating) return;

  state.translating = true;
  elements.translateButton.disabled = true;
  elements.translateButton.textContent = "翻译中...";
  elements.translationResult.textContent = "";
  setStatus("正在翻译...");

  try {
    const data = await requestDeepSeek({
      type: "translate",
      script: state.script,
      direction: state.direction,
      text
    });
    elements.translationResult.textContent = data.reply;
    setStatus("翻译完成，可以点击朗读译文");
  } catch (error) {
    elements.translationResult.textContent = "翻译失败。";
    setStatus(error.message, true);
  } finally {
    state.translating = false;
    elements.translateButton.disabled = false;
    elements.translateButton.textContent = "立即翻译";
  }
}

async function requestDeepSeek(payload) {
  const response = await fetch("/api/deepseek", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `请求失败，HTTP ${response.status}`);
  }
  return data;
}

function renderMessages() {
  elements.messages.innerHTML = "";
  state.messages.forEach((message) => {
    const row = document.createElement("div");
    row.className = `message-row ${message.role}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = message.role === "user" ? "我" : "AI";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = message.content;

    if (message.role === "assistant") {
      const copyButton = document.createElement("button");
      copyButton.className = "copy-button";
      copyButton.type = "button";
      copyButton.textContent = "复制";
      copyButton.addEventListener("click", () => copyText(message.content));
      bubble.appendChild(document.createElement("br"));
      bubble.appendChild(copyButton);
    }

    row.appendChild(avatar);
    row.appendChild(bubble);
    elements.messages.appendChild(row);
  });
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderLearningSections(keyword) {
  const query = keyword.trim().toLowerCase();
  elements.learnSections.innerHTML = "";

  LEARNING_SECTIONS.forEach((section) => {
    const filteredItems = section.items.filter((item) => {
      const text = Object.values(item).join(" ").toLowerCase();
      return !query || text.includes(query);
    });
    if (!filteredItems.length) return;

    const sectionNode = document.createElement("section");
    sectionNode.className = "learn-section";

    const title = document.createElement("div");
    title.className = "learn-title";
    title.innerHTML = `<span>${section.title}</span><small>${filteredItems.length} 项</small>`;
    sectionNode.appendChild(title);

    const grid = document.createElement("div");
    grid.className = section.type === "alphabet" ? "alphabet-grid" : "phrase-grid";

    filteredItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = section.type === "alphabet" ? "letter-card" : "phrase-card";

      if (section.type === "alphabet") {
        card.innerHTML = `
          <div class="letter" dir="rtl">${escapeHtml(item.letter)}</div>
          <div class="card-main">${escapeHtml(item.name)}</div>
          <div class="card-sub">${escapeHtml(item.cn)}</div>
          ${item.note ? `<div class="card-sub">${escapeHtml(item.note)}</div>` : ""}
        `;
      } else {
        card.innerHTML = `
          <div class="card-main">${escapeHtml(item.cn)}</div>
          <div class="kazakh" dir="rtl">${escapeHtml(item.kk)}</div>
          ${item.pron ? `<div class="card-sub">${escapeHtml(item.pron)}</div>` : ""}
        `;
      }

      card.addEventListener("click", () => {
        const text = section.type === "alphabet"
          ? `${item.letter} ${item.name} ${item.cn}${item.note ? `\n${item.note}` : ""}`
          : `${item.cn}\n${item.kk}${item.pron ? `\n${item.pron}` : ""}`;
        copyText(text);
      });
      grid.appendChild(card);
    });

    sectionNode.appendChild(grid);
    elements.learnSections.appendChild(sectionNode);
  });

  if (!elements.learnSections.children.length) {
    elements.learnSections.innerHTML = '<p class="empty">没有找到匹配内容。</p>';
  }
}

function showRandomPractice() {
  const phraseSections = LEARNING_SECTIONS.filter((section) => section.type !== "alphabet");
  const allItems = phraseSections.flatMap((section) =>
    section.items.map((item) => ({ ...item, section: section.title }))
  );
  const item = allItems[Math.floor(Math.random() * allItems.length)];
  elements.practiceCard.classList.remove("hidden");
  elements.practiceCard.innerHTML = `
    <div class="practice-label">${escapeHtml(item.section)}</div>
    <div class="practice-cn">${escapeHtml(item.cn)}</div>
    <div class="practice-kk" dir="rtl">${escapeHtml(item.kk)}</div>
    ${item.pron ? `<div class="practice-pron">${escapeHtml(item.pron)}</div>` : ""}
  `;
}

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  state.voices = window.speechSynthesis.getVoices();
}

function sourceLanguage() {
  return state.direction === "zh2kk" ? "zh-CN" : kazakhSpeechLanguage();
}

function targetLanguage() {
  return state.direction === "zh2kk" ? kazakhSpeechLanguage() : "zh-CN";
}

function kazakhSpeechLanguage() {
  return state.script === "cyrillic" ? "kk-KZ" : "ug-CN";
}

function speakText(text, lang) {
  const cleanText = text.trim();
  if (!cleanText || cleanText === "翻译后的内容会显示在这里。" || cleanText === "翻译失败。") {
    setStatus("没有可朗读的文字", true);
    return;
  }

  if (!("speechSynthesis" in window)) {
    setStatus("当前浏览器不支持朗读功能", true);
    return;
  }

  stopSpeech();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.86;
  utterance.pitch = 1.08;
  utterance.volume = 0.9;
  utterance.voice = pickSoftFemaleVoice(lang);
  utterance.onstart = () => setStatus("正在朗读...");
  utterance.onend = () => setStatus("朗读完成");
  utterance.onerror = () => setStatus("朗读失败，请换浏览器或检查系统语音包", true);
  window.speechSynthesis.speak(utterance);
}

function pickSoftFemaleVoice(lang) {
  loadVoices();
  const voices = state.voices;
  if (!voices.length) return null;

  const preferredWords = [
    "xiaoxiao",
    "xiaoyi",
    "huihui",
    "female",
    "woman",
    "girl",
    "zira",
    "aria",
    "natural"
  ];
  const langPrefix = lang.split("-")[0].toLowerCase();
  const matchingLang = voices.filter((voice) =>
    voice.lang.toLowerCase().startsWith(langPrefix)
  );
  const candidates = matchingLang.length ? matchingLang : voices;

  return (
    candidates.find((voice) =>
      preferredWords.some((word) => voice.name.toLowerCase().includes(word))
    ) ||
    candidates.find((voice) => voice.default) ||
    candidates[0]
  );
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function setLoading(isLoading) {
  state.loading = isLoading;
  elements.sendButton.disabled = isLoading;
  elements.sendButton.textContent = isLoading ? "发送中..." : "发送";
}

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

async function copyText(text) {
  const cleanText = text.trim();
  if (!cleanText || cleanText === "翻译后的内容会显示在这里。") return;

  try {
    await navigator.clipboard.writeText(cleanText);
    setStatus("已复制到剪贴板");
  } catch (error) {
    setStatus("复制失败，请手动选择文字复制。", true);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
