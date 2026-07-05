<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <span class="eyebrow">Learn by doing</span>
        <h1 class="hero-title">Refactoring Rust</h1>
        <p class="hero-subtitle">
          27 hands-on exercises to write more idiomatic, maintainable Rust.
          Take working-but-awkward code and make it shine.
        </p>
      </div>
    </section>

    <section class="exercises-section">
      <div class="container">
        <div class="exercises-grid">
          <router-link
            v-for="exercise in exercises"
            :key="exercise.id"
            :to="`/exercise/${exercise.id}`"
            class="exercise-card"
          >
            <div class="exercise-number">{{ exercise.id }}</div>
            <div class="exercise-info">
              <h3 class="exercise-title">{{ exercise.title }}</h3>
              <p class="exercise-description">{{ exercise.description }}</p>
            </div>
            <div class="exercise-status">
              <span v-if="isCompleted(exercise.id)" class="status-badge completed">
                Done
              </span>
              <span v-else class="status-badge pending">
                Todo
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { exercises } from '@/data/exercises'

const completedKey = 'refacto-completed'

function getCompleted(): Set<number> {
  try {
    const data = localStorage.getItem(completedKey)
    return data ? new Set(JSON.parse(data)) : new Set()
  } catch {
    return new Set()
  }
}

function isCompleted(id: number): boolean {
  return getCompleted().has(id)
}
</script>

<style scoped>
.home {
  min-height: calc(100vh - 56px);
}

.hero {
  padding: var(--space-4xl) var(--space-xl);
  text-align: center;
  background: var(--color-canvas);
}

.hero-title {
  font: var(--text-display-xl);
  margin: var(--space-sm) 0;
}

.hero-subtitle {
  font: var(--text-body-lg);
  color: var(--color-body);
  max-width: 600px;
  margin: 0 auto;
}

.exercises-section {
  padding: var(--space-3xl) var(--space-xl);
  background: var(--color-canvas-soft);
}

.exercises-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-lg);
}

.exercise-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--color-canvas);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}

.exercise-card:hover {
  box-shadow: var(--shadow-soft);
  transform: translateY(-2px);
}

.exercise-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  background: var(--color-ink);
  color: var(--color-on-primary);
  border-radius: var(--radius-full);
  font: var(--text-body-sm-strong);
}

.exercise-info {
  flex: 1;
  min-width: 0;
}

.exercise-title {
  font: var(--text-display-sub-sm);
  margin-bottom: var(--space-xs);
}

.exercise-description {
  font: var(--text-body-sm);
  color: var(--color-body);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.exercise-status {
  flex-shrink: 0;
}

.status-badge {
  padding: var(--space-xxs) var(--space-md);
  border-radius: var(--radius-pill);
  font: var(--text-caption);
  font-weight: 500;
}

.status-badge.completed {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.status-badge.pending {
  background: var(--color-canvas-soft);
  color: var(--color-body-mid);
}

@media (max-width: 768px) {
  .exercises-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 40px;
    line-height: 40px;
  }
}
</style>
