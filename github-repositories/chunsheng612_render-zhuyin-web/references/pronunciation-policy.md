# 注音讀音政策

Use this reference when pronunciation accuracy matters, especially for educational content.

## Separate pronunciation from layout

Treat the bundled blackboard geometry as a display standard only. Do not infer that a pinyin library automatically follows Taiwan Ministry of Education pronunciation choices.

## Default policy

Normalize Taiwan Traditional text to Simplified Chinese with `opencc-js` only for contextual `pinyin-pro` lookup, while preserving the original Traditional characters for display. This lets the Simplified phrase dictionary distinguish common words such as 「音樂／銀行」. Then maintain application-owned `phraseOverrides` for Taiwan-specific readings, names, domain terms, and curriculum vocabulary.

Prefer phrase overrides to single-character overrides because polyphonic readings depend on context:

- 「快樂」 uses 「樂」 as `ㄌㄜˋ`.
- 「音樂」 uses 「樂」 as `ㄩㄝˋ`.
- 「銀行」 uses 「行」 as `ㄏㄤˊ`.
- 「行人」 uses 「行」 as `ㄒㄧㄥˊ`.

For school-facing or assessed material, verify the final word-level readings against the Taiwan Ministry of Education dictionary selected by the project. Record reviewed words in `phraseOverrides` so the result remains deterministic.

## Coverage versus correctness

Define two independent acceptance checks:

1. Coverage: every eligible Han character has a non-empty Zhuyin annotation.
2. Correctness: contextual readings have been checked against the project's pronunciation authority.

Never describe 100% coverage as 100% linguistic correctness.
