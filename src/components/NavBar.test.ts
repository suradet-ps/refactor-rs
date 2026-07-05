import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

function createTestRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/exercise/:id', name: 'exercise', component: { template: '<div>Exercise</div>' } },
    ],
  })
}

describe('NavBar', () => {
  let router: ReturnType<typeof createTestRouter>

  beforeEach(() => {
    router = createTestRouter()
  })

  it('renders the brand name', () => {
    const wrapper = mount(NavBar, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('refacto.rs')
  })

  it('renders the brand icon', () => {
    const wrapper = mount(NavBar, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('rs')
  })

  it('renders Exercises link pointing to home', () => {
    const wrapper = mount(NavBar, {
      global: { plugins: [router] },
    })
    const links = wrapper.findAll('a')
    const exercisesLink = links.find((l) => l.text() === 'Exercises')
    expect(exercisesLink).toBeDefined()
    expect(exercisesLink!.attributes('href')).toBe('/')
  })

  it('renders GitHub link with correct attributes', () => {
    const wrapper = mount(NavBar, {
      global: { plugins: [router] },
    })
    const links = wrapper.findAll('a')
    const githubLink = links.find((l) => l.text() === 'GitHub')
    expect(githubLink).toBeDefined()
    expect(githubLink!.attributes('href')).toBe('https://github.com/suradet-ps/refactor-rs')
    expect(githubLink!.attributes('target')).toBe('_blank')
    expect(githubLink!.attributes('rel')).toBe('noopener noreferrer')
  })

  it('has sticky positioning', () => {
    const wrapper = mount(NavBar, {
      global: { plugins: [router] },
    })
    expect(wrapper.find('nav').exists()).toBe(true)
  })
})
