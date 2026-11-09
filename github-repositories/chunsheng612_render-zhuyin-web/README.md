# render-zhuyin-web

Codex Skill for automatically annotating every eligible Han character in a web page with contextual Mandarin Zhuyin / Bopomofo.

It includes:

- Context-aware polyphonic readings through `pinyin-pro`
- Inline annotation for ordinary web text
- The original 中文直式注音 blackboard layout
- Phrase and position overrides
- Dynamic DOM annotation
- Strict zero-missing-character coverage validation

## Install

Clone this repository into your Codex skills folder:

```bash
cd ~/.codex/skills
git clone https://github.com/chunsheng612/render-zhuyin-web.git
```

Invoke it with a request such as:

```text
Use $render-zhuyin-web to add contextual Zhuyin to every Chinese character
on this page and verify complete coverage.
```

Created by 方方老師. The vertical tone layout references the 經濟部標準檢驗局 digital publishing standard for Mandarin Zhuyin tone-mark positioning.
