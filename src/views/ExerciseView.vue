<template>
  <div class="exercise-view" v-if="exercise">
    <div class="exercise-header">
      <div class="header-info">
        <span class="exercise-num">Exercise {{ exercise.id }}</span>
        <h1 class="exercise-title">{{ exercise.title }}</h1>
      </div>
      <div class="header-actions">
        <div class="btn-group">
          <button
            class="btn-icon"
            @click="resetCode"
            title="Reset code"
            aria-label="Reset code to starter"
          >
            <RotateCcw :size="16" aria-hidden="true" />
          </button>
        </div>

        <div class="btn-group">
          <button
            class="btn-run"
            @click="runCode"
            :disabled="runningAction !== null"
            :aria-busy="runningAction === 'run'"
          >
            <Play v-if="runningAction !== 'run'" :size="14" aria-hidden="true" />
            <Loader2 v-else :size="14" class="spin" aria-hidden="true" />
            {{ runningAction === 'run' ? 'Running...' : 'Run' }}
          </button>
          <button
            class="btn-test"
            @click="runTests"
            :disabled="runningAction !== null"
            :aria-busy="runningAction === 'test'"
          >
            <Bug v-if="runningAction !== 'test'" :size="14" aria-hidden="true" />
            <Loader2 v-else :size="14" class="spin" aria-hidden="true" />
            {{ runningAction === 'test' ? 'Running...' : 'Tests' }}
          </button>
        </div>

        <div class="btn-group">
          <button
            class="btn-ghost"
            @click="showSolution = !showSolution"
            :aria-label="showSolution ? 'Hide solution' : 'Show solution'"
            :aria-expanded="showSolution"
          >
            <Eye v-if="!showSolution" :size="16" aria-hidden="true" />
            <EyeOff v-else :size="16" aria-hidden="true" />
          </button>
          <button
            class="btn-done"
            :class="{ active: isCompleted }"
            @click="markCompleted"
            :aria-pressed="isCompleted"
          >
            <CheckCircle v-if="isCompleted" :size="14" aria-hidden="true" />
            <Circle v-else :size="14" aria-hidden="true" />
            {{ isCompleted ? 'Done' : 'Complete' }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSolution"
      class="modal-overlay"
      @click.self="showSolution = false"
      @keydown.escape="showSolution = false"
    >
      <div
        ref="modalRef"
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Solution"
        tabindex="-1"
      >
        <div class="modal-header">
          <span class="modal-title">Solution</span>
          <button
            class="modal-close"
            @click="showSolution = false"
            aria-label="Close solution"
          >
            <X :size="18" aria-hidden="true" />
          </button>
        </div>
        <div ref="solutionContainer" class="modal-code" />
      </div>
    </div>

    <div class="panels">
      <div class="editor-panel">
        <div ref="editorContainer" class="code-editor" role="region" aria-label="Code editor" />
      </div>

      <div class="divider" />

      <div class="output-panel">
        <div class="output-container" ref="outputContainer" role="region" aria-label="Program output">
          <pre v-if="output" class="output-text">{{ output }}</pre>
          <div v-else class="output-placeholder">
            <p>Run or Tests to see output</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <div class="container">
      <h2>Exercise not found</h2>
      <router-link to="/" class="btn btn-primary">Back to Exercises</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { rust } from '@codemirror/lang-rust'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { Bug, CheckCircle, Circle, Eye, EyeOff, Loader2, Play, RotateCcw, X } from 'lucide-vue-next'
import { computed, nextTick, onMounted, onScopeDispose, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { exercises } from '@/data/exercises'

const route = useRoute()

const code = ref('')
const output = ref('')
const showSolution = ref(false)
const runningAction = ref<'run' | 'test' | null>(null)
const outputContainer = ref<HTMLElement | null>(null)
const editorContainer = ref<HTMLElement | null>(null)
const solutionContainer = ref<HTMLElement | null>(null)
const modalRef = ref<HTMLElement | null>(null)

let editorView: EditorView | null = null
let solutionView: EditorView | null = null

const completedKey = 'refacto-completed'
const codeKey = 'refacto-code'

const exercise = computed(() => {
  const id = Number(route.params.id)
  return exercises.find((e) => e.id === id)
})

const isCompleted = ref(false)

function loadCompleted() {
  if (!exercise.value) return
  try {
    const data = localStorage.getItem(completedKey)
    const completed: number[] = data ? JSON.parse(data) : []
    isCompleted.value = completed.includes(exercise.value.id)
  } catch {
    isCompleted.value = false
  }
}

function createEditor() {
  if (!editorContainer.value) return

  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged) {
      code.value = update.state.doc.toString()
    }
  })

  const state = EditorState.create({
    doc: code.value,
    extensions: [
      lineNumbers(),
      keymap.of([...defaultKeymap, indentWithTab]),
      rust(),
      oneDark,
      EditorView.lineWrapping,
      updateListener,
    ],
  })

  editorView = new EditorView({
    state,
    parent: editorContainer.value,
  })
}

function destroyEditor() {
  editorView?.destroy()
  editorView = null
}

function setEditorContent(newCode: string) {
  if (!editorView) return
  editorView.dispatch({
    changes: {
      from: 0,
      to: editorView.state.doc.length,
      insert: newCode,
    },
  })
}

function loadCode() {
  if (!exercise.value) return
  const saved = localStorage.getItem(`${codeKey}-${exercise.value.id}`)
  code.value = saved || exercise.value.starterCode
  output.value = ''
  setEditorContent(code.value)
  loadCompleted()
}

function saveCode() {
  if (!exercise.value) return
  localStorage.setItem(`${codeKey}-${exercise.value.id}`, code.value)
}

function resetCode() {
  if (!exercise.value) return
  code.value = exercise.value.starterCode
  output.value = ''
  saveCode()
  setEditorContent(code.value)
}

function scrollToOutput() {
  nextTick(() => {
    if (outputContainer.value) {
      outputContainer.value.scrollTop = outputContainer.value.scrollHeight
    }
  })
}

async function runCode() {
  runningAction.value = 'run'
  output.value = ''
  try {
    const result = await evaluateCode(code.value, false)
    output.value = formatResult(result)
  } catch (e) {
    output.value = `Error: ${e instanceof Error ? e.message : String(e)}`
  }
  runningAction.value = null
  scrollToOutput()
}

async function runTests() {
  runningAction.value = 'test'
  output.value = ''
  try {
    const result = await evaluateCode(code.value, true)
    output.value = formatResult(result)
  } catch (e) {
    output.value = `Error: ${e instanceof Error ? e.message : String(e)}`
  }
  runningAction.value = null
  scrollToOutput()
}

interface PlaygroundResult {
  success: boolean
  stdout: string
  stderr: string
}

async function evaluateCode(codeStr: string, tests: boolean): Promise<PlaygroundResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const body = {
      channel: 'stable',
      mode: 'debug',
      edition: '2021',
      crateType: 'lib',
      tests,
      code: codeStr,
      backtrace: false,
    }

    const res = await fetch('https://play.rust-lang.org/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Playground returned ${res.status}: ${text}`)
    }

    return res.json()
  } finally {
    clearTimeout(timeout)
  }
}

function formatResult(result: PlaygroundResult): string {
  const parts: string[] = []
  if (result.stderr) parts.push(result.stderr.trimEnd())
  if (result.stdout) parts.push(result.stdout.trimEnd())
  if (parts.length === 0) {
    return result.success ? 'Program exited with code 0' : 'Compilation failed'
  }
  return parts.join('\n')
}

function markCompleted() {
  if (!exercise.value) return
  try {
    const data = localStorage.getItem(completedKey)
    const completed: number[] = data ? JSON.parse(data) : []
    const idx = completed.indexOf(exercise.value.id)
    if (idx === -1) {
      completed.push(exercise.value.id)
    } else {
      completed.splice(idx, 1)
    }
    localStorage.setItem(completedKey, JSON.stringify(completed))
    isCompleted.value = !isCompleted.value
  } catch {
    // ignore
  }
}

function createSolutionEditor() {
  if (!solutionContainer.value || !exercise.value) return

  solutionView = new EditorView({
    doc: exercise.value.solutionCode,
    extensions: [
      lineNumbers(),
      rust(),
      oneDark,
      EditorView.lineWrapping,
      EditorState.readOnly.of(true),
      EditorView.editable.of(false),
    ],
    parent: solutionContainer.value,
  })
}

function destroySolutionEditor() {
  solutionView?.destroy()
  solutionView = null
}

let previousActiveElement: HTMLElement | null = null

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !modalRef.value) return

  const focusable = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

const stopSolutionWatch = watch(showSolution, (val) => {
  if (val) {
    previousActiveElement = document.activeElement as HTMLElement
    nextTick(() => {
      createSolutionEditor()
      modalRef.value?.focus()
      document.addEventListener('keydown', trapFocus)
    })
  } else {
    destroySolutionEditor()
    document.removeEventListener('keydown', trapFocus)
    previousActiveElement?.focus()
  }
})
onScopeDispose(stopSolutionWatch)

watch(() => route.params.id, loadCode, { immediate: true })

onMounted(() => {
  createEditor()
})

onUnmounted(() => {
  destroyEditor()
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.exercise-view {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 56px);
  overflow: hidden;
}

.exercise-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-xl);
  background: var(--color-canvas);
  border-bottom: 1px solid var(--color-canvas-soft);
  flex-shrink: 0;
  gap: var(--space-md);
}

.exercise-num {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-body-mid);
}

.exercise-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: var(--color-ink);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  background: var(--color-canvas-soft);
  border-radius: 6px;
  border: 1px solid var(--color-canvas-soft);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  background: transparent;
  color: var(--color-body);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: var(--color-canvas);
  color: var(--color-ink);
}

.btn-run {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 28px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-run:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-test {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 28px;
  background: var(--color-canvas);
  color: var(--color-ink);
  border: 1px solid var(--color-canvas-soft);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-test:hover:not(:disabled) {
  background: var(--color-canvas-soft);
}

.btn-ghost {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 28px;
  background: transparent;
  color: var(--color-body);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-ghost:hover {
  background: var(--color-canvas-soft);
  color: var(--color-ink);
}

.btn-done {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 10px;
  height: 28px;
  background: transparent;
  color: var(--color-body);
  border: 1px solid var(--color-canvas-soft);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-done:hover {
  background: var(--color-canvas-soft);
  color: var(--color-ink);
  border-color: var(--color-body-mid);
}

.btn-done.active {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-color: var(--color-primary);
}

.btn-done.active:hover {
  opacity: 0.85;
}

.panels {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: var(--space-md);
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  gap: var(--space-sm);
}

.editor-panel {
  flex: 1;
  min-height: 0;
  max-height: 50vh;
  display: flex;
}

.code-editor {
  width: 100%;
  flex: 1;
  border: 1px solid var(--color-dark-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.code-editor :deep(.cm-editor) {
  height: 100%;
}

.code-editor :deep(.cm-scroller) {
  overflow: auto;
}

.code-editor :deep(.cm-gutters) {
  background: var(--color-dark-canvas);
  border-right: 1px solid var(--color-dark-border);
  color: var(--color-dark-text-muted);
}

.divider {
  height: 1px;
  background: var(--color-dark-border);
  flex-shrink: 0;
}

.output-panel {
  flex: 1;
  min-height: 150px;
  max-height: 40vh;
  display: flex;
}

.output-container {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md);
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: var(--radius-md);
  font: var(--text-code);
  color: var(--color-dark-text-secondary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-text {
  margin: 0;
  color: var(--color-dark-text);
}

.output-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-dark-text-muted);
  font: var(--text-body-sm);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-xl);
}

.modal {
  background: var(--color-dark-surface);
  border: 1px solid var(--color-dark-border);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 720px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-dark-border);
  flex-shrink: 0;
}

.modal-title {
  font: var(--text-body-sm-strong);
  color: var(--color-dark-text);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-dark-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: var(--color-dark-surface-hover);
  color: var(--color-dark-text);
}

.modal-code {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.modal-code :deep(.cm-editor) {
  height: 100%;
}

.modal-code :deep(.cm-scroller) {
  overflow: auto;
}

.modal-code :deep(.cm-gutters) {
  background: var(--color-dark-canvas);
  border-right: 1px solid var(--color-dark-border);
  color: var(--color-dark-text-muted);
}

.not-found {
  padding: var(--space-4xl) var(--space-xl);
  text-align: center;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .exercise-view {
    height: auto;
    min-height: calc(100vh - 56px);
    overflow: auto;
  }

  .panels {
    min-height: 600px;
  }

  .exercise-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
