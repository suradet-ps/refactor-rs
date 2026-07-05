import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import { exercises } from '@/data/exercises'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/exercise/:id', name: 'exercise', component: { template: '<div>Exercise</div>' } },
  ],
})

describe('HomeView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the hero section', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Refactoring Rust')
    expect(wrapper.text()).toContain('27 hands-on exercises')
  })

  it('renders eyebrow text', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    expect(wrapper.text()).toContain('Learn by doing')
  })

  it('renders all 27 exercise cards', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const cards = wrapper.findAll('.exercise-card')
    expect(cards.length).toBe(27)
  })

  it('each exercise card has correct link', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const cards = wrapper.findAll('.exercise-card')
    for (const card of cards) {
      expect(card.attributes('href')).toMatch(/^\/exercise\/\d+$/)
    }
  })

  it('displays exercise titles', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    for (const exercise of exercises) {
      expect(wrapper.text()).toContain(exercise.title)
    }
  })

  it('displays exercise descriptions', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    for (const exercise of exercises) {
      expect(wrapper.text()).toContain(exercise.description)
    }
  })

  it('shows Todo badge for uncompleted exercises', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const badges = wrapper.findAll('.status-badge.pending')
    expect(badges.length).toBe(27)
  })

  it('shows Done badge for completed exercises', async () => {
    localStorage.setItem('refacto-completed', JSON.stringify([1, 3, 5]))

    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const doneBadges = wrapper.findAll('.status-badge.completed')
    expect(doneBadges.length).toBe(3)

    const todoBadges = wrapper.findAll('.status-badge.pending')
    expect(todoBadges.length).toBe(24)
  })

  it('handles corrupted localStorage gracefully', async () => {
    localStorage.setItem('refacto-completed', 'not-valid-json')

    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const badges = wrapper.findAll('.status-badge.pending')
    expect(badges.length).toBe(27)
  })

  it('renders exercise numbers', async () => {
    router.push('/')
    await router.isReady()

    const wrapper = mount(HomeView, {
      global: { plugins: [router] },
    })
    const numbers = wrapper.findAll('.exercise-number')
    expect(numbers.length).toBe(27)
    expect(numbers[0].text()).toBe('1')
    expect(numbers[26].text()).toBe('27')
  })
})
