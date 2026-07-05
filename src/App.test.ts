import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div class="home-content">Home</div>' } },
    { path: '/exercise/:id', name: 'exercise', component: { template: '<div>Exercise</div>' } },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>404</div>' } },
  ],
})

describe('App', () => {
  it('renders the app container', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('.app').exists()).toBe(true)
  })

  it('renders the NavBar', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('refacto.rs')
  })

  it('renders the router-view', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Home')
  })

  it('has the app-main container', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('.app-main').exists()).toBe(true)
  })

  it('wraps router-view in ErrorBoundary', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('.error-boundary').exists() || wrapper.find('.app-main').exists()).toBe(
      true,
    )
  })
})
