<template>
  <div class="exercise-view" v-if="exercise">
    <div class="exercise-header">
      <div class="header-info">
        <span class="exercise-num">Exercise {{ exercise.id }}</span>
        <h1 class="exercise-title">{{ exercise.title }}</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-sm btn-secondary" @click="resetCode">
          <RotateCcw :size="14" />
          Reset
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="runCode"
          :disabled="runningAction !== null"
        >
          <Play v-if="runningAction !== 'run'" :size="14" />
          <Loader2 v-else :size="14" class="spin" />
          {{ runningAction === 'run' ? 'Running...' : 'Run' }}
        </button>
        <button
          class="btn btn-sm btn-secondary"
          @click="runTests"
          :disabled="runningAction !== null"
        >
          <Bug v-if="runningAction !== 'test'" :size="14" />
          <Loader2 v-else :size="14" class="spin" />
          {{ runningAction === 'test' ? 'Running...' : 'Tests' }}
        </button>
        <button class="btn btn-sm btn-tertiary" @click="showSolution = !showSolution">
          <Eye v-if="!showSolution" :size="14" />
          <EyeOff v-else :size="14" />
          Solution
        </button>
        <button
          class="btn btn-sm btn-primary"
          @click="markCompleted"
          :disabled="isCompleted"
        >
          <CheckCircle v-if="isCompleted" :size="14" />
          <Circle v-else :size="14" />
          {{ isCompleted ? 'Done' : 'Complete' }}
        </button>
      </div>
    </div>

    <div v-if="showSolution" class="modal-overlay" @click.self="showSolution = false">
      <div class="modal">
        <div class="modal-header">
          <span class="modal-title">Solution</span>
          <button class="modal-close" @click="showSolution = false">
            <X :size="18" />
          </button>
        </div>
        <pre class="modal-code"><code>{{ exercise.solutionCode }}</code></pre>
      </div>
    </div>

    <div class="panels">
      <div class="editor-panel">
        <div ref="editorContainer" class="code-editor" />
      </div>

      <div class="divider" />

      <div class="output-panel">
        <div class="output-container" ref="outputContainer">
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
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { exercises } from '@/data/exercises'
import {
  Eye, EyeOff, CheckCircle, Circle,
  RotateCcw, Play, Loader2, Bug, X
} from 'lucide-vue-next'
import { EditorView, keymap, lineNumbers } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { rust } from '@codemirror/lang-rust'
import { oneDark } from '@codemirror/theme-one-dark'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'

const route = useRoute()

const code = ref('')
const output = ref('')
const showSolution = ref(false)
const runningAction = ref<'run' | 'test' | null>(null)
const outputContainer = ref<HTMLElement | null>(null)
const editorContainer = ref<HTMLElement | null>(null)

let editorView: EditorView | null = null

const completedKey = 'refacto-completed'
const codeKey = 'refacto-code'

const exercise = computed(() => {
  const id = Number(route.params.id)
  return exercises.find(e => e.id === id)
})

const isCompleted = computed(() => {
  if (!exercise.value) return false
  try {
    const data = localStorage.getItem(completedKey)
    const completed: number[] = data ? JSON.parse(data) : []
    return completed.includes(exercise.value.id)
  } catch {
    return false
  }
})

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
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Playground returned ${res.status}: ${text}`)
  }

  return res.json()
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
    if (!completed.includes(exercise.value.id)) {
      completed.push(exercise.value.id)
      localStorage.setItem(completedKey, JSON.stringify(completed))
    }
  } catch {
    // ignore
  }
}

watch(() => route.params.id, loadCode, { immediate: true })

onMounted(() => {
  createEditor()
})

onUnmounted(() => {
  destroyEditor()
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
  font: var(--text-eyebrow);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-primary);
}

.exercise-title {
  font: var(--text-body-sm-strong);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--space-xs);
  flex-shrink: 0;
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
  border: 1px solid #30363d;
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
  background: #0d1117;
  border-right: 1px solid #30363d;
  color: #484f58;
}

.divider {
  height: 1px;
  background: #30363d;
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
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: var(--radius-md);
  font: var(--text-code);
  color: #8b949e;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.output-text {
  margin: 0;
  color: #c9d1d9;
}

.output-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #484f58;
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
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 720px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid #30363d;
  flex-shrink: 0;
}

.modal-title {
  font: var(--text-body-sm-strong);
  color: #c9d1d9;
}

.modal-close {
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: #21262d;
  color: #c9d1d9;
}

.modal-code {
  margin: 0;
  padding: var(--space-md);
  background: #0d1117;
  color: #c9d1d9;
  font: var(--text-code);
  line-height: 1.6;
  overflow: auto;
  flex: 1;
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
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions .btn {
    flex: 1;
  }
}
</style>
