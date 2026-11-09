"use strict";

const assert = require("node:assert/strict");
const zhuyin = require("../assets/zhuyin-renderer/zhuyin-renderer.js");

const conversionCases = {
  ye4: "ㄧㄝˋ",
  yan3: "ㄧㄢˇ",
  yang2: "ㄧㄤˊ",
  "lü3": "ㄌㄩˇ",
  "nu:3": "ㄋㄩˇ",
  weng1: "ㄨㄥ",
  ju4: "ㄐㄩˋ",
  jiong3: "ㄐㄩㄥˇ",
  zhi1: "ㄓ",
  de0: "˙ㄉㄜ",
  de5: "˙ㄉㄜ"
};

for (const [pinyin, expected] of Object.entries(conversionCases)) {
  assert.equal(zhuyin.convertPinyinToZhuyin(pinyin), expected, pinyin);
}

assert.equal(zhuyin.isHanChar("學"), true);
assert.equal(zhuyin.isHanChar("𠀀"), true);
assert.equal(zhuyin.isHanChar("A"), false);

const contextual = {
  "快樂": ["kuai4", "le4"],
  "音樂": ["yin1", "yue4"],
  "銀行": ["yin2", "hang2"],
  "行人": ["xing2", "ren2"],
  "至": ["zhi4"]
};

function pinyinFn(text) {
  return contextual[text] || [];
}

const sentence = zhuyin.annotateText("快樂，銀行", { pinyinFn });
assert.deepEqual(
  sentence.tokens.filter((token) => token.type === "han").map((token) => token.zhuyin),
  ["ㄎㄨㄞˋ", "ㄌㄜˋ", "ㄧㄣˊ", "ㄏㄤˊ"]
);
assert.equal(sentence.coverage, 1);

const overridden = zhuyin.annotateText("音樂", {
  pinyinFn,
  phraseOverrides: { "音樂": ["ㄧㄣ", "ㄌㄜˋ"] }
});
assert.deepEqual(
  overridden.tokens.filter((token) => token.type === "han").map((token) => token.zhuyin),
  ["ㄧㄣ", "ㄌㄜˋ"]
);
assert.equal(overridden.tokens[1].source, "phrase-override");

assert.throws(
  () => zhuyin.annotateText("龘", { pinyinFn: () => ["龘"] }),
  (error) => error.name === "ZhuyinCoverageError" && error.unresolved[0].char === "龘"
);
assert.throws(
  () => zhuyin.annotateText("快樂", { pinyinFn: () => ["kuai4"] }),
  /one reading per Han character/
);
assert.throws(
  () => zhuyin.annotateText("快樂", {
    pinyinFn,
    pinyinTextNormalizer: () => "快乐呀"
  }),
  /preserve the Unicode character count/
);
assert.throws(
  () => zhuyin.annotateText("快樂", {
    pinyinFn,
    phraseOverrides: { "快樂": ["ㄎㄨㄞˋ"] }
  }),
  /one Zhuyin reading per Han character/
);

const inline = zhuyin.buildInlineTextHTML("快樂", { pinyinFn });
assert.match(inline, /data-zhuyin-char="快"/);
assert.match(inline, /data-zhuyin="ㄌㄜˋ"/);
assert.match(inline, /aria-hidden="true"/);

const vertical = zhuyin.buildVerticalTextHTML("至", { pinyinFn });
assert.match(vertical, /data-zhuyin-char="至"/);
assert.doesNotMatch(vertical, /︱/);

const range = zhuyin.buildVerticalTextHTML("至", { pinyinFn, rangeWordsAsDash: true });
assert.match(range, /︱/);

if (process.env.ZHUYIN_INTEGRATION === "1") {
  const { pinyin } = require("pinyin-pro");
  const OpenCC = require("opencc-js");
  const { JSDOM } = require("jsdom");
  const toSimplified = OpenCC.Converter({ from: "tw", to: "cn" });
  const cases = {
    "快樂": ["ㄎㄨㄞˋ", "ㄌㄜˋ"],
    "音樂": ["ㄧㄣ", "ㄩㄝˋ"],
    "銀行": ["ㄧㄣˊ", "ㄏㄤˊ"],
    "行人": ["ㄒㄧㄥˊ", "ㄖㄣˊ"],
    "好的了嗎": ["ㄏㄠˇ", "˙ㄉㄜ", "˙ㄌㄜ", "˙ㄇㄚ"]
  };

  for (const [text, expected] of Object.entries(cases)) {
    const result = zhuyin.annotateText(text, {
      pinyinFn: pinyin,
      pinyinTextNormalizer: toSimplified
    });
    assert.deepEqual(
      result.tokens.filter((token) => token.type === "han").map((token) => token.zhuyin),
      expected,
      text
    );
  }

  const dom = new JSDOM("<main><p>快樂</p><code>程式</code><span data-no-zhuyin>略過</span></main>");
  const main = dom.window.document.querySelector("main");
  const session = zhuyin.annotateElement(main, {
    pinyinFn: pinyin,
    pinyinTextNormalizer: toSimplified,
    strict: true
  });
  assert.equal(session.report.totalHan, 2);
  assert.equal(session.report.annotatedHan, 2);
  assert.equal(session.report.coverage, 1);
  assert.equal(main.querySelectorAll("[data-zhuyin-char]").length, 2);
  assert.equal(main.querySelector("code").textContent, "程式");
  assert.equal(main.querySelector("[data-no-zhuyin]").textContent, "略過");

  const paragraph = dom.window.document.createElement("p");
  paragraph.textContent = "音樂";
  main.appendChild(paragraph);
  const textSession = zhuyin.annotateElement(paragraph.firstChild, {
    pinyinFn: pinyin,
    pinyinTextNormalizer: toSimplified,
    strict: true
  });
  assert.equal(textSession.report.coverage, 1);
  assert.equal(paragraph.querySelectorAll("[data-zhuyin-char]").length, 2);

  const mutable = dom.window.document.createElement("p");
  mutable.textContent = "plain text";
  main.appendChild(mutable);
  const mutableText = mutable.firstChild;

  const observed = zhuyin.annotateElement(main, {
    pinyinFn: pinyin,
    pinyinTextNormalizer: toSimplified,
    strict: true,
    observeMutations: true
  });
  const dynamic = dom.window.document.createElement("p");
  dynamic.textContent = "銀行";
  main.appendChild(dynamic);
  mutableText.nodeValue = "更新";
  setImmediate(() => {
    assert.equal(dynamic.querySelectorAll("[data-zhuyin-char]").length, 2);
    assert.equal(mutable.querySelectorAll("[data-zhuyin-char]").length, 2);
    assert.equal(zhuyin.validateCoverage(main).coverage, 1);
    observed.disconnect();
  });
}

console.log("render-zhuyin-web renderer tests passed");
