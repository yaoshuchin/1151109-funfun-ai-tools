# 全頁注音整合

Use this reference when annotating an existing page, framework application, or dynamic DOM.

## Runtime dependency

For Traditional Chinese pages, install `pinyin-pro` and `opencc-js`. Normalize a Taiwan Traditional Han run to Simplified Chinese only for pinyin lookup; keep the original characters for display:

```js
import { pinyin } from "pinyin-pro";
import OpenCC from "opencc-js";
import "./zhuyin-renderer.css";

const toSimplified = OpenCC.Converter({ from: "tw", to: "cn" });
const result = BlackboardZhuyin.annotateText("快樂學習", {
  pinyinFn: pinyin,
  pinyinTextNormalizer: toSimplified,
  strict: true
});
```

Keep each contiguous Han run intact. The renderer calls `pinyin()` with `{ toneType: "num", type: "array" }` so words such as 「快樂」、「音樂」、「銀行」, and 「行人」 retain sentence context. Reject a normalizer result whose Unicode character count differs from the original run.

For a plain browser build, load local browser bundles of `opencc-js` and `pinyin-pro` before `zhuyin-renderer.js`. Do not rely on the small bundled common-character map for complete coverage.

## Static text and server rendering

Call `annotateText(text, options)`, then render its tokens through the target framework. Render a Han token with `buildCharHTML(token.char, token.zhuyin, { layout: "inline", strict: false })`; escape or render text tokens normally.

Call `buildInlineTextHTML(text, options)` only when inserting trusted renderer output as HTML. The renderer escapes input text, but framework-native components are preferable.

## Existing DOM

Annotate an existing non-framework page with:

```js
const session = BlackboardZhuyin.annotateElement(document.body, {
  pinyinFn: pinyin,
  pinyinTextNormalizer: toSimplified,
  strict: true,
  observeMutations: true
});
```

The DOM adapter preserves existing elements and replaces eligible text nodes. It skips scripts, styles, code, form controls, SVG, existing ruby markup, hidden content, `[data-no-zhuyin]`, and previously processed output.

Pronunciation context is text-node-local because the adapter preserves element boundaries. Keep polyphonic words in one text node. If markup splits a word across elements, resolve the complete phrase with `annotateText` before framework rendering instead of relying on DOM mutation.

Call `session.disconnect()` when mutation monitoring is no longer needed.

## React, Vue, and Svelte

Do not call `annotateElement` inside a framework-owned root because direct DOM replacement can conflict with reconciliation or hydration. Instead:

1. Call `annotateText` before rendering.
2. Map each Han token to a component that reproduces the bundled pair markup.
3. Use the character and source index as stable keys.
4. Keep the Zhuyin track `aria-hidden="true"` so assistive technology reads the original Han text once.

## Overrides

Apply corrections in this precedence order:

1. `overrideResolver` for a specific source position.
2. `phraseOverrides` for context-specific words.
3. `overrides` for global single-character choices.
4. Contextual `pinyin-pro` output.
5. The bundled common-character fallback.

Write phrase values as an array or a space-separated sequence with exactly one reading per Han character:

```js
{
  phraseOverrides: {
    "音樂": ["ㄧㄣ", "ㄩㄝˋ"],
    "快樂": "ㄎㄨㄞˋ ㄌㄜˋ"
  }
}
```

## Coverage

Keep `strict: true` for production generation. An unresolved Han character raises `ZhuyinCoverageError` with the character, source index, and context.

After DOM rendering, require:

```js
const report = BlackboardZhuyin.validateCoverage(document.body);
if (report.coverage !== 1) throw new Error("Incomplete Zhuyin coverage");
```

Coverage measures whether every eligible Han character has a non-empty annotation. It does not prove that every context-dependent pronunciation is linguistically correct; review instructional text under the selected pronunciation policy.
