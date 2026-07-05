# refacto.rs

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-42b883?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Rust](https://img.shields.io/badge/Rust-2021-dea584?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df?logo=bun&logoColor=black)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Interactive platform for learning idiomatic Rust through refactoring exercises. Edit code, run it, and see results — all in one screen.

## Features

- **20 curated exercises** — from basic to advanced refactoring patterns
- **In-browser code editor** — Rust syntax highlighting with CodeMirror 6
- **Live execution** — run code or tests via Rust Playground API
- **Dark terminal UI** — code editor on top, output below
- **Progress tracking** — completed exercises saved to localStorage
- **Solution viewer** — modal popup with idiomatic solutions

## Getting Started

```bash
# Clone the repository
git clone https://github.com/suradet-ps/refactor-rs.git
cd refactor-rs

# Install dependencies
bun install

# Start development server
bun run dev
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Vue 3](https://vuejs.org/) + Composition API |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vitejs.dev/) |
| Package Manager | [Bun](https://bun.sh/) |
| Code Editor | [CodeMirror 6](https://codemirror.net/) |
| Rust Backend | [Rust Playground API](https://play.rust-lang.org/) |
| Icons | [Lucide](https://lucide.dev/) |

## Exercises

| # | Title | Topic |
|---|-------|-------|
| 1 | Starts with uppercase | `&str` vs `String`, `is_some_and` |
| 2 | Better match | Match arm merging |
| 3 | Even numbers | Iterators, `step_by` |
| 4 | Truncate string | `chars().take()` |
| 5 | Path extension | `is_some_and` on `Option` |
| 6 | Nesting | `and_then` chaining |
| 7 | Optional values | `flatten`, `sum` |
| 8 | Parse integers | `collect::<Result<_>>()` |
| 9 | Error handling | `?` operator |
| 10 | Parse port | Match with binding |
| 11 | Dedup runs | `dedup()` |
| 12 | Excluded path | `any()` |
| 13 | Spell check | `filter`, case-insensitive |
| 14 | Room occupancy | Iterator adapters |
| 15 | Highest and lowest | `max`, `min` |
| 16 | Mode | `max_by_key` |
| 17 | Trim log line | `split_whitespace` |
| 18 | Parse SRT timestamp | `split_once` |
| 19 | Iterators | Custom iterator, `from_fn` |
| 20 | Transformer | Pattern matching, `map` |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE)
