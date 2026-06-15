const LEARNING_SECTIONS = [
  {
    title: "一、中国新疆哈萨克语字母表（官方通用阿拉伯字母体系）",
    type: "alphabet",
    items: [
      { letter: "ا", name: "[ɑ]", cn: "啊（长音）", note: "开口大圆元音，发音饱满厚重。" },
      { letter: "ە", name: "[e]", cn: "哎（轻短）", note: "半开口前元音，可出现在单词任意位置。" },
      { letter: "ى", name: "[ɯ]", cn: "俄式轻伊（平舌）", note: "舌位靠后，嘴巴放松，不咧嘴。" },
      { letter: "ي", name: "[i]", cn: "伊（标准短音）", note: "闭口前元音，可作元音或半辅音。" },
      { letter: "ۋ", name: "[u]", cn: "乌（圆唇）", note: "闭口圆唇元音，可作元音和半辅音。" },
      { letter: "ۆ", name: "[o]", cn: "喔（轻圆）", note: "中圆唇元音，介于喔和欧之间。" },
      { letter: "ۇ", name: "[ʊ]", cn: "乌（短轻）", note: "短乌音，发音短促放松。" },
      { letter: "ې", name: "[æ]", cn: "哎（大口）", note: "大口前元音，发音更响亮。" },
      { letter: "ۈ", name: "[y]", cn: "迂", note: "圆唇前元音，和汉语迂接近。" },
      { letter: "ب", name: "[b]", cn: "波（轻浊）", note: "浊辅音，词尾会轻微弱化。" },
      { letter: "پ", name: "[p]", cn: "泼（清送气）", note: "清辅音，送气明显。" },
      { letter: "ت", name: "[t]", cn: "特（轻清）", note: "清辅音，发音轻巧。" },
      { letter: "د", name: "[d]", cn: "德（轻浊）", note: "浊辅音，词中读音更柔和。" },
      { letter: "چ", name: "[tʃ]", cn: "切（轻）", note: "清塞擦音，轻柔发音。" },
      { letter: "ج", name: "[dʒ]", cn: "杰（轻浊）", note: "浊塞擦音，本土高频辅音。" },
      { letter: "خ", name: "[χ]", cn: "哈（喉音）", note: "从喉咙送气，区别于汉语 h。" },
      { letter: "ح", name: "[h]", cn: "喝（轻气音）", note: "轻清气音，多用于外来词。" },
      { letter: "ق", name: "[q]", cn: "卡（喉重音）", note: "小舌清辅音，喉咙后部发力。" },
      { letter: "ك", name: "[k]", cn: "克（轻清）", note: "普通清辅音，发音轻柔。" },
      { letter: "گ", name: "[g]", cn: "格（轻浊）", note: "浊辅音，发音柔和。" },
      { letter: "ف", name: "[f]", cn: "夫（轻）", note: "清唇齿辅音。" },
      { letter: "ۋ", name: "[w]", cn: "乌（半辅）", note: "半辅音形态，类似 w。" },
      { letter: "ل", name: "[l]", cn: "勒（轻）", note: "边辅音，词尾不卷舌。" },
      { letter: "م", name: "[m]", cn: "姆（闭口）", note: "双唇鼻音。" },
      { letter: "ن", name: "[n]", cn: "恩（轻）", note: "齿龈鼻音，使用范围广。" },
      { letter: "ڭ", name: "[ŋ]", cn: "昂（鼻音）", note: "后鼻音，只出现在词中、词尾。" },
      { letter: "ر", name: "[r]", cn: "勒（颤音）", note: "齿龈颤音，轻颤舌尖。" },
      { letter: "س", name: "[s]", cn: "斯（轻清）", note: "清平舌辅音。" },
      { letter: "ز", name: "[z]", cn: "兹（轻浊）", note: "浊平舌辅音，声带振动。" },
      { letter: "ش", name: "[ʃ]", cn: "师（轻）", note: "清翘舌辅音。" },
      { letter: "ژ", name: "[ʒ]", cn: "日（轻浊）", note: "浊翘舌辅音，声带振动。" },
      { letter: "ھ", name: "[h]", cn: "轻气音", note: "极轻清辅音，常作拼读衔接。" },
      { letter: "ء", name: "[ʔ]", cn: "无声停顿", note: "隔音符号，用于分隔元音、区分拼写。" }
    ]
  },
  {
    title: "二、常用问候语",
    type: "phrase",
    items: [
      { cn: "你好", kk: "سەلەم", pron: "salem" },
      { cn: "您好", kk: "سەلەمەتسىز بە", pron: "salemetsiz be" },
      { cn: "早上好", kk: "قايرلى تاڭ", pron: "qayırlı tañ" },
      { cn: "下午好", kk: "قايرلى كۈن", pron: "qayırlı kün" },
      { cn: "晚上好", kk: "قايرلى كەش", pron: "qayırlı keş" },
      { cn: "再见", kk: "ساۋ بول", pron: "saw bol" },
      { cn: "谢谢", kk: "راحىمەت", pron: "raqmet" },
      { cn: "不客气", kk: "وقاسى جوق", pron: "oqası joq" },
      { cn: "对不起", kk: "كەشىرىڭىز", pron: "keşiriñiz" },
      { cn: "请", kk: "ۆتىنەمىن", pron: "ötinemin" }
    ]
  },
  {
    title: "三、日常交流",
    type: "phrase",
    items: [
      { cn: "你叫什么名字？", kk: "سىزدىڭ اتىڭىز قانداي؟" },
      { cn: "我叫……", kk: "مەنىڭ اتىم ……" },
      { cn: "你好吗？", kk: "جاقسىسىزبە؟" },
      { cn: "我很好。", kk: "مەن جاقسىمىن." },
      { cn: "你来自哪里？", kk: "قايدان كەلدىڭىز؟" },
      { cn: "我来自中国。", kk: "مەن جۇڭگودان كەلدىم." },
      { cn: "很高兴认识你。", kk: "تانىسقانىما قۇانىشتىمىن." }
    ]
  },
  {
    title: "四、数字",
    type: "phrase",
    items: [
      { cn: "1", kk: "بىر" },
      { cn: "2", kk: "ەكى" },
      { cn: "3", kk: "ٷش" },
      { cn: "4", kk: "تۆرت" },
      { cn: "5", kk: "بەس" },
      { cn: "6", kk: "التى" },
      { cn: "7", kk: "جەتى" },
      { cn: "8", kk: "سەگىز" },
      { cn: "9", kk: "توقىز" },
      { cn: "10", kk: "ون" }
    ]
  },
  {
    title: "五、家庭成员",
    type: "phrase",
    items: [
      { cn: "父亲", kk: "ٵكە" },
      { cn: "母亲", kk: "انا" },
      { cn: "哥哥", kk: "اعا" },
      { cn: "姐姐", kk: "ٵپكە" },
      { cn: "弟弟", kk: "ىنى" },
      { cn: "妹妹", kk: "سىڭلى" },
      { cn: "儿子", kk: "ۇل" },
      { cn: "女儿", kk: "قىز" }
    ]
  },
  {
    title: "六、常见词汇",
    type: "phrase",
    items: [
      { cn: "水", kk: "سۇ" },
      { cn: "茶", kk: "شاي" },
      { cn: "牛奶", kk: "سٷت" },
      { cn: "羊", kk: "قوي" },
      { cn: "马", kk: "ات" },
      { cn: "家", kk: "ٷي" },
      { cn: "学校", kk: "مەكتەپ" },
      { cn: "医院", kk: "اۋرۇحانا" },
      { cn: "中国", kk: "جۇڭگو" },
      { cn: "新疆", kk: "شىنجاڭ" },
      { cn: "哈萨克", kk: "قازاق" }
    ]
  }
];
