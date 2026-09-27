# refacto.rs

[![CI](https://github.com/suradet-ps/refactor-rs/actions/workflows/ci.yml/badge.svg)](https://github.com/suradet-ps/refactor-rs/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Vue v3](https://img.shields.io/badge/Vue-v3-4FC08D.svg?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![TypeScript v6](https://img.shields.io/badge/TypeScript-v6-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite v8](https://img.shields.io/badge/Vite-v8-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/suradet-ps/refactor-rs/issues)

---

## ◆ PULSE

Rust is learned in the refactor, not in the tutorial. refacto.rs is an
interactive platform for idiomatic Rust: 27 curated exercises, each a
piece of working-but-clunky code, each with a destination in mind -
`is_some_and`, `and_then` chaining, `split_once`, `from_fn`, a mini
Redis of enum routing. Edit in a CodeMirror editor, run against the
Rust Playground, watch the compiler answer - all in one dark terminal
screen.

| 27 exercises ▣ | Live run ▣ | Progress ▣ | Solutions ▣ |
|---|---|---|---|

*The loop - edit, run, learn, advance - is sealed.*

> Built with Vue 3 + TypeScript + CodeMirror 6, executed by the Rust
> Playground API - the compiler is the teacher's assistant.
>
> **suradet-ps**, artifact keeper

---

## ◆ IGNITION

One runtime, three commands.

```
⟫ git clone https://github.com/suradet-ps/refactor-rs.git
⟫ cd refactor-rs
⟫ bun install
⟫ bun run dev
```

<details>
<summary>Prerequisites</summary>

- [Bun](https://bun.sh/) - the package manager
- An internet connection for the Rust Playground API during exercises

</details>

---

## ◆ ANATOMY

One screen, two panes, 27 doors into the standard library.

- **Edits** - CodeMirror 6 renders Rust with syntax highlighting in
  the editor pane; the code is the lesson and the workspace in one.
- **Runs** - code and tests execute through the Rust Playground API,
  with the output pane below - the compiler's verdict arrives where
  the work happened.
- **Progresses** - completed exercises persist to `localStorage`; the
  nav arrows move prev and next through the course without losing
  ground.
- **Reveals** - the solution viewer opens each exercise's idiomatic
  answer in a modal - the destination is shown after the attempt, not
  before it.
- **Serves** - a dark terminal UI tuned for the exercise loop: editor
  above, output below, focus trap and Escape working for the keyboard
  in between.

---

## ◆ RITUALS

**The core ceremony** - one exercise, one refactor:

1. Read the exercise: working code with a clunky shape and a named
   target pattern.
2. Edit in the pane - try the idiom the exercise is teaching.
3. Run it. The compiler answers; the output pane reports.
4. Passed? Progress is saved, the next arrow lights. Stuck? The
   solution modal shows the idiomatic path after the honest attempt.

**The ceremony of the compiler** - no hidden judge: the code runs
against real Rust, and the result is the result. The Playground is the
referee and the lesson is the difference between the two panes.

**The ceremony of the attempt** - the solution stays behind the modal
until the attempt has been made. Learning the destination matters
less than having tried the route.

---

## ◆ ECHOES

**Where this artifact is heading**

```
curate   ▸ 27 exercises, basic to advanced ─────────────────────────── ▸ sealed
execute  ▸ Rust Playground run, tests included ─────────────────────── ▸ sealed
persist  ▸ localStorage progress, prev/next nav ────────────────────── ▸ sealed
reveal   ▸ solution modal after the attempt ────────────────────────── ▸ sealed
```

**Raising the artifact** - the exercises descend from
[Refactoring Rust](https://github.com/corrode/refactoring-rust) by
corrode; the quality bar is Biome and the Vitest suite. Open an issue
first to discuss a change.

**Status** - CI gates every push on the way to Vercel.
[Watch the gates](.github/workflows).

---

```
  ─────────────────────────────────────────
   Nobody learns Rust by reading it.
   Everyone learns Rust by reshaping it.
  ─────────────────────────────────────────
```

Source code under the [MIT License](LICENSE).