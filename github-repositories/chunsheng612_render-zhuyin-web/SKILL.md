---
name: render-zhuyin-web
description: Automatically annotate every eligible Han character in static or dynamic web pages with contextual Mandarin Zhuyin/Bopomofo, complete-coverage validation, inline text flow, and blackboard-style vertical layout. Use when building, editing, reviewing, or fixing HTML, CSS, JavaScript, React, Vue, or Svelte pages that must add 注音 to all Chinese text, convert Chinese sentences to Zhuyin, handle polyphonic words or light tones, audit missing annotations, or render horizontal and vertical Zhuyin UI.
---

# Render Zhuyin Web

Add contextual Zhuyin to every eligible Han character and prove that none were silently omitted. Treat pronunciation resolution, visual rendering, and coverage validation as one workflow.

## Use the bundled implementation

Copy or port these files into the target project:

- `assets/zhuyin-renderer/zhuyin-renderer.js`
- `assets/zhuyin-renderer/zhuyin-renderer.css`

Install `pinyin-pro` with the target project's package manager. For Traditional Chinese pages, also install `opencc-js` and pass a Taiwan-Traditional-to-Simplified converter as `pinyinTextNormalizer`; use the normalized text only for pinyin lookup and preserve the original characters for display. Pass `pinyin-pro`'s `pinyin` function as `pinyinFn`, or load browser bundles before the renderer. Do not claim full coverage when only the bundled common-character fallback is available.

Read `references/full-page-integration.md` before integrating an existing page, framework application, server-rendered output, or dynamic DOM.

Read `references/pronunciation-policy.md` when the page is educational, must follow Taiwan Mandarin usage, or contains names and domain-specific terms.

Read `references/blackboard-zhuyin-logic.md` when implementing the vertical blackboard layout, changing geometry, or checking tone-mark placement.

## Require the full annotation workflow

Perform these steps in order:

1. Identify all user-visible text that should receive Zhuyin and mark intentional exclusions with `data-no-zhuyin`.
2. Normalize Traditional Han runs for dictionary lookup when needed, preserving one Unicode character per source character.
3. Resolve each contiguous Han run as a whole through `pinyin-pro` using `{ toneType: "num", type: "array" }`.
4. Convert each numeric pinyin syllable to Zhuyin and preserve a one-to-one Han-token mapping.
5. Apply character, phrase, or source-position overrides.
6. Render each Han token with a non-empty fixed Zhuyin track.
7. Run strict coverage validation and fix every unresolved character before finishing.

Never resolve an entire sentence primarily through repeated single-character calls. Sentence context is required for polyphonic words such as 「快樂／音樂」 and 「銀行／行人」.

## Resolve readings in this precedence order

Use the highest available source:

1. `overrideResolver` for a specific source position.
2. `phraseOverrides` for context-dependent words.
3. `overrides` for global single-character choices.
4. Contextual `pinyin-pro` output.
5. `COMMON_ZHUYIN` only as a fallback.
6. An unresolved error.

Keep `strict: true` unless deliberately collecting an unresolved report. Never convert an unresolved Han character into an empty visual track and call the page complete.

## Use the renderer APIs

Use `annotateText(text, options)` for build-time, server-side, and framework rendering:

```js
const result = BlackboardZhuyin.annotateText("快樂學習", {
  pinyinFn: pinyin,
  pinyinTextNormalizer: toSimplified,
  strict: true,
  phraseOverrides: {}
});
```

The result contains `tokens`, `totalHan`, `annotatedHan`, `unresolved`, and `coverage`.

Use `buildInlineTextHTML(text, options)` for trusted static HTML generation.

Use `annotateElement(root, options)` only for non-framework DOM trees:

```js
const session = BlackboardZhuyin.annotateElement(document.body, {
  pinyinFn: pinyin,
  strict: true,
  observeMutations: true
});
```

Use `validateCoverage(root)` after rendering and require `coverage === 1`.

For React, Vue, and Svelte, map `annotateText` tokens to framework components. Do not mutate a framework-owned root with `annotateElement`.

## Detect all Han characters

Use Unicode `Unified_Ideograph` matching plus `〇`, with the bundled fallback ranges for older engines. Do not use only `[\u4e00-\u9fa5]`; it omits valid Han characters.

Exclude scripts, styles, templates, code samples, form controls, SVG, canvas, existing ruby markup, hidden content, `aria-hidden` content, `[data-no-zhuyin]`, and already processed renderer output.

## Render inline text

Use the bundled inline pair markup and CSS so annotated prose can wrap normally:

- Keep the Han character visible and readable by assistive technology.
- Mark the Zhuyin track `aria-hidden="true"` to avoid duplicate speech.
- Use `inline-flex` for each Han-Zhuyin pair.
- Inherit the surrounding font size instead of forcing the blackboard's pixel size.
- Preserve punctuation and non-Han text without annotation.

## Render vertical blackboard text

Keep the source geometry unless the user requests a different visual system:

- Hanzi slot width: `fs`.
- Zhuyin size: `round(fs * 0.35)`.
- Zhuyin track width: `round(zySize * 2.4)`.
- Cell height: `round(fs * 1.55)`.
- Track margin-left: `2px`.
- Blank non-Han tracks: reserve the same width when grid alignment requires them.

Render standard tones `ˊ`, `ˇ`, and `ˋ` at the upper-right of the final Zhuyin symbol without widening the track. Render light tone `˙` as a leading occupied slot, accepting either `˙ㄉㄜ` or `ㄉㄜ˙` as input.

Group contiguous ASCII letters, digits, `%`, and `.` in the Hanzi slot. Render `-`, `~`, and `～` as vertical `︱`. Convert 「至」 to a dash only when `rangeWordsAsDash: true`; otherwise annotate it as a Han character.

## Validate before finishing

Run the bundled renderer tests:

```bash
node scripts/test-renderer.js
```

Then verify the target page:

- Require `validateCoverage(root).coverage === 1`.
- Confirm the unresolved list is empty.
- Test 「快樂、音樂、銀行、行人」 for contextual polyphonic readings.
- Test `葉、眼、楊、女、溫、居、窘` to cover y/w, ü, and j/q/x conversion rules.
- Test first, second, third, fourth, and light tones.
- Test punctuation, mixed ASCII, dynamic content, and intentional exclusions.
- Check that standard tones do not change cell width.
- Check that screen readers encounter each Han character once.

Treat 100% annotation coverage and pronunciation correctness as separate checks. For assessed or school-facing content, verify word-level readings under the project's chosen Taiwan Ministry of Education dictionary policy and save corrections as phrase overrides.
