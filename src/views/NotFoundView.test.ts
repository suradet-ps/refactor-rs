import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
})

describe('NotFoundView', () => {
  it('renders 404 code', async () => {
    router.push('/nonexistent')
    await router.isReady()

    const wrapper = mount(NotFoundView, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('404')
  })

  it('renders page not found title', async () => {
    router.push('/nonexistent')
    await router.isReady()

    const wrapper = mount(NotFoundView, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('h1').text()).toBe('Page not found')
  })

  it('renders descriptive message', async () => {
    router.push('/nonexistent')
    await router.isReady()

    const wrapper = mount(NotFoundView, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain("doesn't exist or has been moved")
  })

  it('renders back to exercises link', async () => {
    router.push('/nonexistent')
    await router.isReady()

    const wrapper = mount(NotFoundView, {
      global: { plugins: [router] },
    })
    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Back to exercises')
    expect(link.attributes('href')).toBe('/')
  })
})
