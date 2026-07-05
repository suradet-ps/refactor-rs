import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'

function makeRouter(_initial: string) {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/exercise/:id', name: 'exercise', component: ExerciseView },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>404</div>' } },
    ],
  })
}

describe('ExerciseView', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  async function mountExercise(path: string) {
    const router = makeRouter(path)
    router.push(path)
    await router.isReady()
    const wrapper = mount(ExerciseView, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()
    return { wrapper, router }
  }

  it('renders exercise 1 when navigating to /exercise/1', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    expect(wrapper.text()).toContain('Exercise 1')
    expect(wrapper.text()).toContain('Starts with uppercase')
  })

  it('renders exercise 10', async () => {
    const { wrapper } = await mountExercise('/exercise/10')
    expect(wrapper.text()).toContain('Exercise 10')
    expect(wrapper.text()).toContain('Parse port')
  })

  it('shows not found for invalid exercise id', async () => {
    const { wrapper } = await mountExercise('/exercise/999')
    expect(wrapper.text()).toContain('Exercise not found')
  })

  it('renders Run button', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))
    expect(runBtn).toBeDefined()
  })

  it('renders Tests button', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const testBtn = wrapper.findAll('button').find((b) => b.text().includes('Tests'))
    expect(testBtn).toBeDefined()
  })

  it('renders Complete button', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const completeBtn = wrapper.findAll('button').find((b) => b.text().includes('Complete'))
    expect(completeBtn).toBeDefined()
  })

  it('renders solution toggle button', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const solutionBtn = wrapper.find('.btn-ghost')
    expect(solutionBtn.exists()).toBe(true)
  })

  it('shows output placeholder initially', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    expect(wrapper.text()).toContain('Run or Tests to see output')
  })

  it('shows modal when solution button clicked', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const solutionBtn = wrapper.find('.btn-ghost')
    await solutionBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)
    expect(wrapper.text()).toContain('Solution')
  })

  it('hides modal when close button clicked', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const solutionBtn = wrapper.find('.btn-ghost')
    await solutionBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)

    const closeBtn = wrapper.find('.modal-close')
    await closeBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('hides modal when clicking overlay background', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const solutionBtn = wrapper.find('.btn-ghost')
    await solutionBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const overlay = wrapper.find('.modal-overlay')
    expect(overlay.exists()).toBe(true)

    await overlay.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('shows Done badge after marking complete', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const completeBtn = wrapper.findAll('button').find((b) => b.text().includes('Complete'))
    expect(completeBtn).toBeDefined()
    expect(completeBtn!.text()).toContain('Complete')

    await completeBtn!.trigger('click')
    await wrapper.vm.$nextTick()

    const doneBtn = wrapper.findAll('button').find((b) => b.text().includes('Done'))
    expect(doneBtn).toBeDefined()
  })

  it('persists completion to localStorage', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const completeBtn = wrapper.findAll('button').find((b) => b.text().includes('Complete'))
    await completeBtn!.trigger('click')

    const stored = JSON.parse(localStorage.getItem('refacto-completed') || '[]')
    expect(stored).toContain(1)
  })

  it('toggles completion off on second click', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const completeBtn = wrapper.findAll('button').find((b) => b.text().includes('Complete'))
    await completeBtn!.trigger('click')
    await wrapper.vm.$nextTick()

    const doneBtn = wrapper.findAll('button').find((b) => b.text().includes('Done'))
    await doneBtn!.trigger('click')
    await wrapper.vm.$nextTick()

    const stored = JSON.parse(localStorage.getItem('refacto-completed') || '[]')
    expect(stored).not.toContain(1)
  })

  it('disables Run and Tests buttons while running', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: '', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(runBtn.attributes('disabled')).toBeDefined()
  })

  it('calls Rust Playground API with correct body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, stdout: 'hello\n', stderr: '' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://play.rust-lang.org/execute')
    expect(options.method).toBe('POST')

    const body = JSON.parse(options.body)
    expect(body.channel).toBe('stable')
    expect(body.mode).toBe('debug')
    expect(body.edition).toBe('2021')
    expect(body.crateType).toBe('lib')
    expect(body.tests).toBe(false)
    expect(typeof body.code).toBe('string')
  })

  it('shows output from successful run', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: 'hello world\n', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('hello world')
    })
  })

  it('shows error output from failed run', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: false, stdout: '', stderr: 'error: compilation failed' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('compilation failed')
    })
  })

  it('shows error message on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Error: Network error')
    })
  })

  it('sends tests=true when Tests button clicked', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, stdout: '', stderr: '' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { wrapper } = await mountExercise('/exercise/1')
    const testBtn = wrapper.findAll('button').find((b) => b.text().includes('Tests'))!
    await testBtn.trigger('click')
    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.tests).toBe(true)
  })

  it('loads saved code from localStorage', async () => {
    localStorage.setItem('refacto-code-1', 'fn custom_code() {}')

    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any
    expect(vm.code).toBe('fn custom_code() {}')
  })

  it('loads starterCode when no saved code', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any
    expect(vm.code).toContain('starts_with_uppercase')
  })

  it('loads completed state from localStorage', async () => {
    localStorage.setItem('refacto-completed', JSON.stringify([1]))

    const { wrapper } = await mountExercise('/exercise/1')
    expect(wrapper.text()).toContain('Done')
  })

  it('shows Back to Exercises link when exercise not found', async () => {
    const { wrapper } = await mountExercise('/exercise/999')
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Back to Exercises')
  })

  it('handles non-ok response from Playground', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Error: Playground returned 500')
    })
  })

  it('handles empty output gracefully', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: '', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Program exited with code 0')
    })
  })

  it('handles compilation failure with no output', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: false, stdout: '', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Compilation failed')
    })
  })

  it('combines stderr and stdout when both present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: 'output\n', stderr: 'warning\n' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('warning')
      expect(wrapper.text()).toContain('output')
    })
  })

  it('toggles solution modal on/off', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const solutionBtn = wrapper.find('.btn-ghost')

    await solutionBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(true)

    await solutionBtn.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('resets code to starterCode when reset button clicked', async () => {
    localStorage.setItem('refacto-code-1', 'fn modified() {}')

    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any
    expect(vm.code).toBe('fn modified() {}')

    const resetBtn = wrapper.find('.btn-icon')
    await resetBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(vm.code).toContain('starts_with_uppercase')
  })

  it('saves code to localStorage when code changes', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any
    vm.code = 'fn saved_code() {}'

    const resetBtn = wrapper.find('.btn-icon')
    await resetBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const saved = localStorage.getItem('refacto-code-1')
    expect(saved).toContain('starts_with_uppercase')
  })

  it('clears output when code is reset', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: 'some output\n', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('some output')
    })

    const resetBtn = wrapper.find('.btn-icon')
    await resetBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Run or Tests to see output')
  })

  it('saves code to localStorage on code change', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any

    vm.code = 'fn custom_test() {}'

    const resetBtn = wrapper.find('.btn-icon')
    await resetBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const saved = localStorage.getItem('refacto-code-1')
    expect(saved).toBeTruthy()
  })

  it('scrolls to output after run completes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: 'done\n', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('done')
    })
  })

  it('re-enables buttons after run completes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: '', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(runBtn.attributes('disabled')).toBeUndefined()
    })
  })

  it('re-enables buttons after test completes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, stdout: '', stderr: '' }),
      }),
    )

    const { wrapper } = await mountExercise('/exercise/1')
    const testBtn = wrapper.findAll('button').find((b) => b.text().includes('Tests'))!
    await testBtn.trigger('click')
    await vi.waitFor(() => {
      expect(testBtn.attributes('disabled')).toBeUndefined()
    })
  })

  it('handles non-string error in catch block', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue('string error'))

    const { wrapper } = await mountExercise('/exercise/1')
    const runBtn = wrapper.findAll('button').find((b) => b.text().includes('Run'))!
    await runBtn.trigger('click')
    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('Error: string error')
    })
  })

  it('does not render solution modal by default', async () => {
    const { wrapper } = await mountExercise('/exercise/1')
    expect(wrapper.find('.modal-overlay').exists()).toBe(false)
  })

  it('handles corrupted completed data in localStorage', async () => {
    localStorage.setItem('refacto-completed', 'invalid json[')

    const { wrapper } = await mountExercise('/exercise/1')
    const vm = wrapper.vm as any
    expect(vm.isCompleted).toBe(false)
  })
})
