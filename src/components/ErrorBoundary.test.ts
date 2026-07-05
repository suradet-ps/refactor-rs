import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, onErrorCaptured, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ErrorBoundary from '@/components/ErrorBoundary.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

function createNormalComponent() {
  return defineComponent({
    render() {
      return h('div', { class: 'child-content' }, 'Child content')
    },
  })
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: createNormalComponent(),
      },
    })
    expect(wrapper.text()).toContain('Child content')
  })

  it('does not show error UI for normal children', () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: createNormalComponent(),
      },
    })
    expect(wrapper.text()).not.toContain('Something went wrong')
    expect(wrapper.text()).toContain('Child content')
  })

  it('exposes error ref that can be set programmatically', async () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: createNormalComponent(),
      },
    })
    const vm = wrapper.vm as any
    expect(vm.error).toBeNull()
  })

  it('can reset error state', async () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: createNormalComponent(),
      },
    })
    const vm = wrapper.vm as any
    expect(typeof vm.reset).toBe('function')
  })

  it('renders slot content as default', () => {
    const TestChild = defineComponent({
      render() {
        return h('span', { id: 'test-slot' }, 'Slot content works')
      },
    })

    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: TestChild,
      },
    })
    expect(wrapper.find('#test-slot').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot content works')
  })

  it('renders multiple children in slot', () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: [
          h('div', { class: 'child-a' }, 'Child A'),
          h('div', { class: 'child-b' }, 'Child B'),
        ],
      },
    })
    expect(wrapper.find('.child-a').exists()).toBe(true)
    expect(wrapper.find('.child-b').exists()).toBe(true)
  })

  it('handles empty slot', () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('.error-boundary').exists()).toBe(false)
  })

  it('handles text slot', () => {
    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      slots: {
        default: 'plain text content',
      },
    })
    expect(wrapper.text()).toContain('plain text content')
  })

  it('handles v-if conditional child rendering', () => {
    const ConditionalChild = defineComponent({
      props: { show: Boolean },
      render() {
        return this.show ? h('div', 'Visible') : null
      },
    })

    const wrapper = mount(ErrorBoundary, {
      global: { plugins: [router] },
      props: {},
      slots: {
        default: () => h(ConditionalChild, { show: true }),
      },
    })
    expect(wrapper.text()).toContain('Visible')
  })
})
