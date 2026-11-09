(function(root) {
  "use strict";

  var initials = {
    b: "ㄅ", p: "ㄆ", m: "ㄇ", f: "ㄈ",
    d: "ㄉ", t: "ㄊ", n: "ㄋ", l: "ㄌ",
    g: "ㄍ", k: "ㄎ", h: "ㄏ",
    j: "ㄐ", q: "ㄑ", x: "ㄒ",
    zh: "ㄓ", ch: "ㄔ", sh: "ㄕ", r: "ㄖ",
    z: "ㄗ", c: "ㄘ", s: "ㄙ"
  };

  var finals = {
    a: "ㄚ", o: "ㄛ", e: "ㄜ", eh: "ㄝ",
    ai: "ㄞ", ei: "ㄟ", ao: "ㄠ", ou: "ㄡ",
    an: "ㄢ", en: "ㄣ", ang: "ㄤ", eng: "ㄥ", er: "ㄦ",
    i: "ㄧ", ia: "ㄧㄚ", io: "ㄧㄛ", ie: "ㄧㄝ",
    iao: "ㄧㄠ", iu: "ㄧㄡ", iou: "ㄧㄡ",
    ian: "ㄧㄢ", in: "ㄧㄣ", iang: "ㄧㄤ", ing: "ㄧㄥ",
    u: "ㄨ", ua: "ㄨㄚ", uo: "ㄨㄛ", uai: "ㄨㄞ",
    ui: "ㄨㄟ", uei: "ㄨㄟ", uan: "ㄨㄢ", un: "ㄨㄣ",
    uen: "ㄨㄣ", uang: "ㄨㄤ", ueng: "ㄨㄥ", ong: "ㄨㄥ",
    v: "ㄩ", ve: "ㄩㄝ", van: "ㄩㄢ", vn: "ㄩㄣ", iong: "ㄩㄥ"
  };

  var zeroInitialSyllables = {
    yi: "ㄧ", ya: "ㄧㄚ", yo: "ㄧㄛ", ye: "ㄧㄝ",
    yao: "ㄧㄠ", you: "ㄧㄡ", yan: "ㄧㄢ", yin: "ㄧㄣ",
    yang: "ㄧㄤ", ying: "ㄧㄥ", yong: "ㄩㄥ",
    yu: "ㄩ", yue: "ㄩㄝ", yuan: "ㄩㄢ", yun: "ㄩㄣ",
    wu: "ㄨ", wa: "ㄨㄚ", wo: "ㄨㄛ", wai: "ㄨㄞ",
    wei: "ㄨㄟ", wan: "ㄨㄢ", wen: "ㄨㄣ", wang: "ㄨㄤ", weng: "ㄨㄥ"
  };

  var toneMarks = ["", "", "\u02CA", "\u02C7", "\u02CB"];
  var lightTone = "\u02D9";
  var standardTones = ["\u02CA", "\u02C7", "\u02CB"];

  var COMMON_ZHUYIN = {
    "一": "ㄧ", "二": "ㄦˋ", "三": "ㄙㄢ", "四": "ㄙˋ", "五": "ㄨˇ",
    "六": "ㄌㄧㄡˋ", "七": "ㄑㄧ", "八": "ㄅㄚ", "九": "ㄐㄧㄡˇ", "十": "ㄕˊ",
    "百": "ㄅㄞˇ", "千": "ㄑㄧㄢ", "萬": "ㄨㄢˋ", "零": "ㄌㄧㄥˊ",
    "月": "ㄩㄝˋ", "日": "ㄖˋ", "星": "ㄒㄧㄥ", "期": "ㄑㄧˊ",
    "年": "ㄋㄧㄢˊ", "今": "ㄐㄧㄣ", "天": "ㄊㄧㄢ",
    "國": "ㄍㄨㄛˊ", "語": "ㄩˇ", "數": "ㄕㄨˋ", "學": "ㄒㄩㄝˊ",
    "自": "ㄗˋ", "然": "ㄖㄢˊ", "社": "ㄕㄜˋ", "會": "ㄏㄨㄟˋ",
    "音": "ㄧㄣ", "樂": "ㄩㄝˋ", "體": "ㄊㄧˇ", "育": "ㄩˋ",
    "美": "ㄇㄟˇ", "術": "ㄕㄨˋ", "健": "ㄐㄧㄢˋ", "康": "ㄎㄤ",
    "電": "ㄉㄧㄢˋ", "腦": "ㄋㄠˇ", "英": "ㄧㄥ", "文": "ㄨㄣˊ",
    "彈": "ㄊㄢˊ", "性": "ㄒㄧㄥˋ", "綜": "ㄗㄨㄥ", "合": "ㄏㄜˊ",
    "第": "ㄉㄧˋ", "課": "ㄎㄜˋ", "生": "ㄕㄥ", "字": "ㄗˋ",
    "回": "ㄏㄨㄟˊ", "家": "ㄐㄧㄚ", "作": "ㄗㄨㄛˋ", "業": "ㄧㄝˋ",
    "功": "ㄍㄨㄥ", "明": "ㄇㄧㄥˊ", "穿": "ㄔㄨㄢ",
    "運": "ㄩㄣˋ", "動": "ㄉㄨㄥˋ", "服": "ㄈㄨˊ",
    "習": "ㄒㄧˊ", "讀": "ㄉㄨˊ", "寫": "ㄒㄧㄝˇ",
    "的": "ㄉㄜ˙", "了": "ㄌㄜ˙", "是": "ㄕˋ", "我": "ㄨㄛˇ",
    "不": "ㄅㄨˋ", "有": "ㄧㄡˇ", "在": "ㄗㄞˋ", "和": "ㄏㄜˊ",
    "老": "ㄌㄠˇ", "師": "ㄕ", "同": "ㄊㄨㄥˊ",
    "請": "ㄑㄧㄥˇ", "帶": "ㄉㄞˋ", "交": "ㄐㄧㄠ", "來": "ㄌㄞˊ"
  };

  var hanPattern;
  try {
    hanPattern = new RegExp("^[\\p{Unified_Ideograph}\\u3007]$", "u");
  } catch (err) {
    hanPattern = /^(?:[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6])$/;
  }

  function hasOwn(value, key) {
    return value != null && Object.prototype.hasOwnProperty.call(value, key);
  }

  function isHanChar(char) {
    return hanPattern.test(String(char || ""));
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseZhuyin(str) {
    if (!str) return { chars: [], tone: "", type: "" };
    var charsStr = String(str).trim();
    var tone = "";
    var type = "";

    if (charsStr.indexOf(lightTone) >= 0) {
      charsStr = charsStr.split(lightTone).join("");
      tone = lightTone;
      type = "light";
    } else {
      for (var i = 0; i < standardTones.length; i++) {
        if (charsStr.indexOf(standardTones[i]) >= 0) {
          charsStr = charsStr.split(standardTones[i]).join("");
          tone = standardTones[i];
          type = "standard";
          break;
        }
      }
    }

    return {
      chars: Array.from(charsStr.replace(/\s+/g, "")),
      tone: tone,
      type: type
    };
  }

  function convertPinyinToZhuyin(value) {
    if (!value) return "";
    var py = String(value).trim().toLowerCase()
      .replace(/[’']/g, "")
      .replace(/u:/g, "v")
      .replace(/ü/g, "v");
    var tone = 0;
    var last = py.charAt(py.length - 1);
    if (last >= "0" && last <= "5") {
      tone = parseInt(last, 10);
      py = py.slice(0, -1);
    }
    if (!py) return "";

    var result = zeroInitialSyllables[py] || "";
    if (!result) {
      var initialKey = "";
      var two = py.slice(0, 2);
      if (initials[two]) initialKey = two;
      else if (initials[py.charAt(0)]) initialKey = py.charAt(0);

      var initial = initials[initialKey] || "";
      var fin = initialKey ? py.slice(initialKey.length) : py;
      if ((initialKey === "j" || initialKey === "q" || initialKey === "x") && fin.charAt(0) === "u") {
        fin = "v" + fin.slice(1);
      }
      if (fin === "i" && /^(?:zh|ch|sh|r|z|c|s)$/.test(initialKey)) fin = "";
      result = initial + (fin ? (finals[fin] || "") : "");
      if (!initial && fin && !finals[fin]) result = "";
    }

    if (!result) return "";
    if (tone === 0 || tone === 5) return lightTone + result;
    if (tone >= 2 && tone <= 4) return result + toneMarks[tone];
    return result;
  }

  function resolvePinyinFn(options) {
    if (options && typeof options.pinyinFn === "function") return options.pinyinFn;
    var source = root.pinyinPro;
    if (source && typeof source.pinyin === "function") return source.pinyin;
    if (source && source.default && typeof source.default.pinyin === "function") {
      return source.default.pinyin;
    }
    return null;
  }

  function normalizePinyinResult(value) {
    if (Array.isArray(value)) return value.map(function(item) { return String(item || "").trim(); });
    if (typeof value === "string") return value.trim() ? value.trim().split(/\s+/) : [];
    return [];
  }

  function normalizeZhuyinSequence(value) {
    if (Array.isArray(value)) return value.map(function(item) { return String(item || "").trim(); });
    if (typeof value === "string") return value.trim() ? value.trim().split(/\s+/) : [];
    return [];
  }

  function arrayMatches(haystack, start, needle) {
    if (start + needle.length > haystack.length) return false;
    for (var i = 0; i < needle.length; i++) {
      if (haystack[start + i] !== needle[i]) return false;
    }
    return true;
  }

  function applyPhraseOverrides(chars, readings, sources, options) {
    var overrides = options.phraseOverrides || {};
    var entries = Object.keys(overrides).map(function(phrase) {
      return { phrase: phrase, chars: Array.from(phrase), values: normalizeZhuyinSequence(overrides[phrase]) };
    }).sort(function(a, b) { return b.chars.length - a.chars.length; });
    var locked = new Array(chars.length).fill(false);

    for (var ei = 0; ei < entries.length; ei++) {
      var entry = entries[ei];
      if (!entry.chars.length) continue;
      if (entry.values.length !== entry.chars.length) {
        throw new Error("phraseOverrides must provide one Zhuyin reading per Han character: " + entry.phrase);
      }
      for (var start = 0; start <= chars.length - entry.chars.length; start++) {
        var available = true;
        for (var li = 0; li < entry.chars.length; li++) {
          if (locked[start + li]) available = false;
        }
        if (!available || !arrayMatches(chars, start, entry.chars)) continue;
        for (var vi = 0; vi < entry.values.length; vi++) {
          readings[start + vi] = entry.values[vi];
          sources[start + vi] = "phrase-override";
          locked[start + vi] = true;
        }
      }
    }
  }

  function resolveHanRun(run, runStart, fullText, options) {
    var chars = Array.from(run);
    var readings = new Array(chars.length).fill("");
    var sources = new Array(chars.length).fill("");
    var pinyinFn = resolvePinyinFn(options);
    var pinyinInput = run;

    if (typeof options.pinyinTextNormalizer === "function") {
      pinyinInput = String(options.pinyinTextNormalizer(run) || "");
      if (Array.from(pinyinInput).length !== chars.length) {
        throw new Error("pinyinTextNormalizer must preserve the Unicode character count for: " + run);
      }
    }

    if (pinyinFn) {
      try {
        var values = normalizePinyinResult(pinyinFn(pinyinInput, { toneType: "num", type: "array" }));
        if (values.length !== chars.length) {
          throw new Error("pinyinFn must return one reading per Han character for: " + run);
        }
        for (var pi = 0; pi < values.length; pi++) {
          readings[pi] = convertPinyinToZhuyin(values[pi]);
          if (readings[pi]) {
            sources[pi] = pinyinInput === run ? "contextual-pinyin" : "normalized-contextual-pinyin";
          }
        }
      } catch (err) {
        if (typeof options.onPinyinError === "function") options.onPinyinError(err, run);
        if (options.failOnProviderError === true || (options.failOnProviderError == null && options.strict !== false)) {
          throw err;
        }
      }
    }

    for (var ci = 0; ci < chars.length; ci++) {
      if (!readings[ci] && COMMON_ZHUYIN[chars[ci]]) {
        readings[ci] = COMMON_ZHUYIN[chars[ci]];
        sources[ci] = "common-map";
      }
      if (hasOwn(options.overrides, chars[ci])) {
        readings[ci] = options.overrides[chars[ci]] || "";
        sources[ci] = "character-override";
      }
    }

    applyPhraseOverrides(chars, readings, sources, options);

    var tokens = [];
    for (var i = 0; i < chars.length; i++) {
      if (typeof options.overrideResolver === "function") {
        var resolved = options.overrideResolver({
          char: chars[i],
          index: runStart + i,
          text: fullText,
          run: run,
          runIndex: i,
          zhuyin: readings[i]
        });
        if (resolved !== undefined) {
          readings[i] = resolved || "";
          sources[i] = "position-override";
        }
      }
      tokens.push({
        type: "han",
        char: chars[i],
        zhuyin: readings[i],
        source: sources[i] || "unresolved",
        index: runStart + i,
        context: run
      });
    }
    return tokens;
  }

  function coverageError(unresolved) {
    var preview = unresolved.slice(0, 8).map(function(item) {
      return item.char + "@" + item.index + "（" + item.context + "）";
    }).join(", ");
    var err = new Error("Zhuyin coverage is incomplete: " + preview);
    err.name = "ZhuyinCoverageError";
    err.unresolved = unresolved;
    return err;
  }

  function annotateText(text, options) {
    options = options || {};
    var value = String(text == null ? "" : text);
    var chars = Array.from(value);
    var tokens = [];
    var unresolved = [];
    var totalHan = 0;

    for (var i = 0; i < chars.length;) {
      if (!isHanChar(chars[i])) {
        var textStart = i;
        var plain = "";
        while (i < chars.length && !isHanChar(chars[i])) plain += chars[i++];
        tokens.push({ type: "text", text: plain, index: textStart });
        continue;
      }

      var runStart = i;
      var run = "";
      while (i < chars.length && isHanChar(chars[i])) run += chars[i++];
      var runTokens = resolveHanRun(run, runStart, value, options);
      for (var ri = 0; ri < runTokens.length; ri++) {
        totalHan++;
        tokens.push(runTokens[ri]);
        if (!runTokens[ri].zhuyin) unresolved.push(runTokens[ri]);
      }
    }

    var result = {
      tokens: tokens,
      totalHan: totalHan,
      annotatedHan: totalHan - unresolved.length,
      unresolved: unresolved,
      coverage: totalHan ? (totalHan - unresolved.length) / totalHan : 1
    };
    if (options.strict !== false && unresolved.length) throw coverageError(unresolved);
    return result;
  }

  function getZhuyinForChar(char, options) {
    if (!isHanChar(char)) return "";
    options = options || {};
    var localOptions = {};
    Object.keys(options).forEach(function(key) { localOptions[key] = options[key]; });
    localOptions.strict = false;
    var result = annotateText(char, localOptions);
    return result.tokens.length ? result.tokens[0].zhuyin : "";
  }

  function geometry(options) {
    options = options || {};
    var fs = Math.round(options.fs || 52);
    var zyScale = options.zyScale == null ? 0.35 : options.zyScale;
    var zySpacing = options.zySpacing == null ? 1.1 : options.zySpacing;
    var zySqueeze = options.zySqueeze == null ? 0.1 : options.zySqueeze;
    var cellHMult = options.cellHMult == null ? 1.55 : options.cellHMult;
    var colGapMult = options.colGapMult == null ? 0.18 : options.colGapMult;
    var zySize = Math.round(fs * zyScale);
    var zyW = Math.round(zySize * 2.4);

    return {
      fs: fs,
      zyScale: zyScale,
      zySize: zySize,
      zyW: zyW,
      zySpacing: zySpacing,
      zySqueeze: zySqueeze,
      cellH: Math.round(fs * cellHMult),
      colGap: Math.round(fs * colGapMult),
      inline: options.layout === "inline"
    };
  }

  function trackStyle(g) {
    if (g.inline) {
      return "font-size:" + g.zyScale + "em;width:2.4em;margin-left:0.12em;";
    }
    return "font-size:" + g.zySize + "px;width:" + g.zyW + "px;margin-left:2px;";
  }

  function blankTrack(g) {
    return '<span class="bb-zhuyin-track bb-zhuyin-track--blank" aria-hidden="true" style="' + trackStyle(g) + '"></span>';
  }

  function hanziSlot(char, g) {
    var style = g.inline ? "font-size:1em;width:1em;" : "font-size:" + g.fs + "px;width:" + g.fs + "px;";
    return '<span class="bb-hanzi-slot" style="' + style + '">' + escapeHTML(char) + '</span>';
  }

  function buildCharHTML(char, zy, options) {
    if (!char) return "";
    options = options || {};
    var g = geometry(options);
    if (zy === undefined) zy = getZhuyinForChar(char, options);
    if (isHanChar(char) && !zy && options.strict !== false) {
      throw coverageError([{ char: char, index: 0, context: char }]);
    }

    var pairClass = "bb-zhuyin-pair" + (g.inline ? " bb-zhuyin-pair--inline" : "");
    var data = isHanChar(char)
      ? ' data-zhuyin-char="' + escapeHTML(char) + '" data-zhuyin="' + escapeHTML(zy || "") + '"'
      : "";
    var open = '<span class="' + pairClass + '" data-zhuyin-processed="true"' + data + '>';

    if (!zy) return open + hanziSlot(char, g) + blankTrack(g) + "</span>";

    var p = parseZhuyin(zy);
    var slots = p.chars.length + (p.type === "light" ? 1 : 0);
    var gap = Math.max(0.4, slots > 1 ? g.zySpacing - (slots - 1) * g.zySqueeze : g.zySpacing);
    var cells = [];

    if (p.type === "light") {
      cells.push('<span class="bb-zy-light" style="height:' + gap.toFixed(2) + 'em;">' + escapeHTML(p.tone) + "</span>");
    }
    for (var i = 0; i < p.chars.length; i++) {
      var tone = (i === p.chars.length - 1 && p.type === "standard")
        ? '<span class="bb-zy-tone">' + escapeHTML(p.tone) + "</span>"
        : "";
      cells.push('<span class="bb-zy-char" style="height:' + gap.toFixed(2) + 'em;">' + escapeHTML(p.chars[i]) + tone + "</span>");
    }

    return open
      + hanziSlot(char, g)
      + '<span class="bb-zhuyin-track" aria-hidden="true" style="' + trackStyle(g) + '">'
      + cells.join("")
      + "</span></span>";
  }

  function copyOptions(options, changes) {
    var result = {};
    Object.keys(options || {}).forEach(function(key) { result[key] = options[key]; });
    Object.keys(changes || {}).forEach(function(key) { result[key] = changes[key]; });
    return result;
  }

  function tokensHTML(tokens, options) {
    var renderOptions = copyOptions(options, { layout: "inline", strict: false });
    return tokens.map(function(token) {
      return token.type === "han"
        ? buildCharHTML(token.char, token.zhuyin, renderOptions)
        : escapeHTML(token.text);
    }).join("");
  }

  function buildInlineTextHTML(text, options) {
    options = options || {};
    var annotation = annotateText(text, options);
    return '<span class="bb-zhuyin-inline" data-zhuyin-processed="true">'
      + tokensHTML(annotation.tokens, options)
      + "</span>";
  }

  function buildAsciiHTML(run, options) {
    var g = geometry(options);
    var maxAlphaFs = Math.round(g.fs * 1.15);
    var fitFs = Math.round(g.fs * 0.95 / Math.max(1, run.length));
    var alphaFs = Math.min(maxAlphaFs, Math.max(fitFs, Math.round(g.fs * 0.7)));
    return '<span class="bb-zhuyin-pair" data-zhuyin-processed="true">'
      + '<span class="bb-ascii-slot" style="font-size:' + alphaFs + "px;width:" + g.fs + 'px;">'
      + escapeHTML(run)
      + "</span>"
      + blankTrack(g)
      + "</span>";
  }

  function buildVerticalDashHTML(options) {
    var g = geometry(options);
    var dashFs = Math.round(g.fs * 0.55);
    return '<span class="bb-zhuyin-pair" data-zhuyin-processed="true">'
      + '<span class="bb-hanzi-slot" style="font-size:' + dashFs + "px;font-weight:700;width:" + g.fs + 'px;">︱</span>'
      + blankTrack(g)
      + "</span>";
  }

  function wrapCell(inner, options) {
    var g = geometry(options);
    return '<div class="bb-zhuyin-cell" style="height:' + g.cellH + 'px;">' + inner + "</div>";
  }

  function buildVerticalTextHTML(text, options) {
    options = options || {};
    var g = geometry(options);
    var cols = [];
    var lines = String(text || "").split("\n");

    for (var li = 0; li < lines.length; li++) {
      var line = lines[li].trim();
      if (!line) continue;
      var annotation = annotateText(line, options);
      var byIndex = {};
      annotation.tokens.forEach(function(token) {
        if (token.type === "han") byIndex[token.index] = token.zhuyin;
      });
      var chars = Array.from(line);
      var cells = [];

      for (var i = 0; i < chars.length; i++) {
        var ch = chars[i];
        var rangeDash = ch === "-" || ch === "~" || ch === "～" || (ch === "至" && options.rangeWordsAsDash === true);
        if (rangeDash) {
          cells.push(wrapCell(buildVerticalDashHTML(options), options));
        } else if (/[a-zA-Z0-9.%]/.test(ch)) {
          var run = ch;
          while (i + 1 < chars.length && /[a-zA-Z0-9.%]/.test(chars[i + 1])) run += chars[++i];
          cells.push(wrapCell(buildAsciiHTML(run, options), options));
        } else {
          cells.push(wrapCell(buildCharHTML(ch, byIndex[i], copyOptions(options, { strict: false })), options));
        }
      }

      cols.push('<div class="bb-zhuyin-column" style="margin-right:' + g.colGap + 'px;">' + cells.join("") + "</div>");
    }

    if (options.reverseColumns) cols.reverse();
    return '<div class="bb-zhuyin-board" data-zhuyin-processed="true">' + cols.join("") + "</div>";
  }

  var SKIP_SELECTOR = "script,style,noscript,template,code,pre,textarea,select,option,svg,canvas,ruby,rt,rp,[hidden],[aria-hidden=\"true\"],[data-no-zhuyin],[data-zhuyin-processed]";

  function shouldSkipElement(element) {
    return element && element.nodeType === 1 && typeof element.matches === "function" && element.matches(SKIP_SELECTOR);
  }

  function collectEligibleTextNodes(node, output) {
    output = output || [];
    if (!node) return output;
    if (node.nodeType === 3) {
      if (Array.from(node.nodeValue || "").some(isHanChar)) output.push(node);
      return output;
    }
    if (shouldSkipElement(node)) return output;
    var children = node.childNodes || [];
    for (var i = 0; i < children.length; i++) collectEligibleTextNodes(children[i], output);
    return output;
  }

  function validateCoverage(rootNode) {
    if (!rootNode) throw new Error("validateCoverage requires a DOM root node");
    var pairs = [];
    if (rootNode.nodeType === 1 && rootNode.matches("[data-zhuyin-char]")) pairs.push(rootNode);
    if (typeof rootNode.querySelectorAll === "function") {
      pairs = pairs.concat(Array.from(rootNode.querySelectorAll("[data-zhuyin-char]")));
    }
    var totalHan = pairs.length;
    var annotatedHan = 0;
    var unresolved = [];

    pairs.forEach(function(pair) {
      var char = pair.getAttribute("data-zhuyin-char") || "";
      var zhuyin = pair.getAttribute("data-zhuyin") || "";
      if (zhuyin) annotatedHan++;
      else unresolved.push({ char: char, index: -1, context: "rendered DOM", element: pair });
    });

    collectEligibleTextNodes(rootNode).forEach(function(textNode) {
      Array.from(textNode.nodeValue || "").forEach(function(char, index) {
        if (!isHanChar(char)) return;
        totalHan++;
        unresolved.push({ char: char, index: index, context: textNode.nodeValue || "", node: textNode });
      });
    });

    return {
      totalHan: totalHan,
      annotatedHan: annotatedHan,
      unresolved: unresolved,
      coverage: totalHan ? annotatedHan / totalHan : 1
    };
  }

  function annotateElement(rootNode, options) {
    options = options || {};
    if (!rootNode) throw new Error("annotateElement requires a DOM root node");
    var doc = rootNode.ownerDocument || (rootNode.nodeType === 9 ? rootNode : root.document);
    if (!doc || typeof doc.createElement !== "function") throw new Error("annotateElement requires a browser DOM");
    var validationRoot = rootNode.nodeType === 3 ? rootNode.parentNode : rootNode;
    var nodes = collectEligibleTextNodes(rootNode);
    var plans = [];
    var unresolved = [];

    nodes.forEach(function(textNode) {
      var annotation = annotateText(textNode.nodeValue || "", copyOptions(options, {
        strict: false,
        failOnProviderError: options.strict !== false
      }));
      unresolved = unresolved.concat(annotation.unresolved);
      plans.push({ node: textNode, tokens: annotation.tokens });
    });

    if (options.strict !== false && unresolved.length) throw coverageError(unresolved);

    plans.forEach(function(plan) {
      if (!plan.node.parentNode) return;
      var template = doc.createElement("template");
      template.innerHTML = '<span class="bb-zhuyin-inline" data-zhuyin-processed="true">'
        + tokensHTML(plan.tokens, options)
        + "</span>";
      plan.node.parentNode.replaceChild(template.content, plan.node);
    });

    var observer = null;
    var Observer = doc.defaultView && doc.defaultView.MutationObserver;
    if (options.observeMutations === true && Observer) {
      observer = new Observer(function(records) {
        records.forEach(function(record) {
          if (record.type === "characterData") {
            try {
              annotateElement(record.target, copyOptions(options, { observeMutations: false }));
            } catch (err) {
              if (typeof options.onError === "function") options.onError(err);
              else if (root.console && typeof root.console.error === "function") root.console.error(err);
            }
            return;
          }
          Array.from(record.addedNodes || []).forEach(function(added) {
            try {
              annotateElement(added, copyOptions(options, { observeMutations: false }));
            } catch (err) {
              if (typeof options.onError === "function") options.onError(err);
              else if (root.console && typeof root.console.error === "function") root.console.error(err);
            }
          });
        });
      });
      var observeRoot = rootNode.nodeType === 9 ? rootNode.documentElement : validationRoot;
      if (observeRoot) observer.observe(observeRoot, { childList: true, characterData: true, subtree: true });
    }

    var report = validateCoverage(validationRoot || rootNode);
    if (options.strict !== false && report.unresolved.length) throw coverageError(report.unresolved);
    return {
      report: report,
      observer: observer,
      disconnect: function() { if (observer) observer.disconnect(); }
    };
  }

  var api = {
    COMMON_ZHUYIN: COMMON_ZHUYIN,
    isHanChar: isHanChar,
    parseZhuyin: parseZhuyin,
    convertPinyinToZhuyin: convertPinyinToZhuyin,
    annotateText: annotateText,
    getZhuyinForChar: getZhuyinForChar,
    buildCharHTML: buildCharHTML,
    buildInlineTextHTML: buildInlineTextHTML,
    buildVerticalTextHTML: buildVerticalTextHTML,
    annotateElement: annotateElement,
    validateCoverage: validateCoverage
  };

  root.BlackboardZhuyin = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
