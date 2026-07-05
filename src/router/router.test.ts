import { beforeEach, describe, expect, it } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import router from '@/router/index'

describe('router', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  it('exports a Vue Router instance', () => {
    expect(router).toBeDefined()
    expect(router.options.history).toBeDefined()
  })

  it('has 3 routes (home, exercise, catch-all)', () => {
    expect(router.getRoutes().length).toBe(3)
  })

  it('has home route at /', () => {
    const route = router.getRoutes().find((r) => r.name === 'home')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/')
  })

  it('has exercise route with :id param', () => {
    const route = router.getRoutes().find((r) => r.name === 'exercise')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/exercise/:id')
  })

  it('has catch-all 404 route', () => {
    const route = router.getRoutes().find((r) => r.name === 'not-found')
    expect(route).toBeDefined()
    expect(route?.path).toBe('/:pathMatch(.*)*')
  })

  it('resolves home route', () => {
    const resolved = router.resolve('/')
    expect(resolved.name).toBe('home')
    expect(resolved.path).toBe('/')
  })

  it('resolves exercise route with id', () => {
    const resolved = router.resolve('/exercise/5')
    expect(resolved.name).toBe('exercise')
    expect(resolved.path).toBe('/exercise/5')
    expect(resolved.params.id).toBe('5')
  })

  it('resolves 404 for unknown path', () => {
    const resolved = router.resolve('/unknown-page')
    expect(resolved.name).toBe('not-found')
  })

  it('resolves 404 for deeply nested unknown path', () => {
    const resolved = router.resolve('/some/deep/unknown/path')
    expect(resolved.name).toBe('not-found')
  })

  it('navigates to home', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('home')
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('navigates to exercise', async () => {
    await router.push('/exercise/3')
    expect(router.currentRoute.value.name).toBe('exercise')
    expect(router.currentRoute.value.params.id).toBe('3')
  })

  it('navigates to 404', async () => {
    await router.push('/nonexistent')
    expect(router.currentRoute.value.name).toBe('not-found')
  })

  it('resolves exercise with large id', () => {
    const resolved = router.resolve('/exercise/99999')
    expect(resolved.name).toBe('exercise')
    expect(resolved.params.id).toBe('99999')
  })
})
