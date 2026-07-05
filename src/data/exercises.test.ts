import { describe, expect, it } from 'vitest'
import { exercises } from '@/data/exercises'
import type { Exercise } from '@/types/exercise'

describe('exercises data', () => {
  it('exports a non-empty array', () => {
    expect(exercises).toBeInstanceOf(Array)
    expect(exercises.length).toBeGreaterThan(0)
  })

  it('contains exactly 27 exercises', () => {
    expect(exercises.length).toBe(27)
  })

  it.each(exercises)('exercise #$id has valid structure', (exercise: Exercise) => {
    expect(exercise).toHaveProperty('id')
    expect(exercise).toHaveProperty('slug')
    expect(exercise).toHaveProperty('title')
    expect(exercise).toHaveProperty('description')
    expect(exercise).toHaveProperty('starterCode')
    expect(exercise).toHaveProperty('solutionCode')
  })

  it.each(exercises)('exercise #$id has numeric id', (exercise: Exercise) => {
    expect(typeof exercise.id).toBe('number')
    expect(exercise.id).toBeGreaterThan(0)
  })

  it.each(exercises)('exercise #$id has non-empty slug', (exercise: Exercise) => {
    expect(typeof exercise.slug).toBe('string')
    expect(exercise.slug.length).toBeGreaterThan(0)
  })

  it.each(exercises)('exercise #$id has non-empty title', (exercise: Exercise) => {
    expect(typeof exercise.title).toBe('string')
    expect(exercise.title.length).toBeGreaterThan(0)
  })

  it.each(exercises)('exercise #$id has non-empty description', (exercise: Exercise) => {
    expect(typeof exercise.description).toBe('string')
    expect(exercise.description.length).toBeGreaterThan(0)
  })

  it.each(exercises)('exercise #$id has non-empty starterCode', (exercise: Exercise) => {
    expect(typeof exercise.starterCode).toBe('string')
    expect(exercise.starterCode.length).toBeGreaterThan(0)
  })

  it.each(exercises)('exercise #$id has non-empty solutionCode', (exercise: Exercise) => {
    expect(typeof exercise.solutionCode).toBe('string')
    expect(exercise.solutionCode.length).toBeGreaterThan(0)
  })

  it('has unique ids', () => {
    const ids = exercises.map((e) => e.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('has unique slugs', () => {
    const slugs = exercises.map((e) => e.slug)
    const uniqueSlugs = new Set(slugs)
    expect(uniqueSlugs.size).toBe(slugs.length)
  })

  it('has sequential ids starting from 1', () => {
    const ids = exercises.map((e) => e.id).sort((a, b) => a - b)
    expect(ids).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
      27,
    ])
  })

  it.each(exercises)('exercise #$id starterCode contains Rust code', (exercise: Exercise) => {
    expect(exercise.starterCode).toMatch(/fn |mod |pub /)
  })

  it.each(exercises)('exercise #$id solutionCode contains Rust code', (exercise: Exercise) => {
    expect(exercise.solutionCode).toMatch(/fn |mod |pub /)
  })

  it.each(exercises)('exercise #$id starterCode has doc comment', (exercise: Exercise) => {
    expect(exercise.starterCode).toMatch(/^\/\/!/)
  })

  it('all exercises have valid slug format (snake_case)', () => {
    for (const exercise of exercises) {
      expect(exercise.slug).toMatch(/^[a-z][a-z0-9_]*$/)
    }
  })
})

describe('Exercise type', () => {
  it('matches expected shape', () => {
    const exercise: Exercise = {
      id: 1,
      slug: 'test',
      title: 'Test',
      description: 'Test exercise',
      starterCode: 'fn main() {}',
      solutionCode: 'fn main() {}',
    }
    expect(exercise).toBeDefined()
  })
})
