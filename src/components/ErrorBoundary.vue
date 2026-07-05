<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">!</div>
      <h1 class="error-title">Something went wrong</h1>
      <p class="error-message">{{ error.message }}</p>
      <div class="error-actions">
        <button class="btn btn-primary" @click="reset">Try again</button>
        <router-link to="/" class="btn btn-secondary">Go home</router-link>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err))
  return false
})

function reset() {
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-xl);
}

.error-content {
  text-align: center;
  max-width: 480px;
}

.error-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-error-bg);
  color: var(--color-error);
  font-size: 32px;
  font-weight: 700;
}

.error-title {
  font: var(--text-display-md);
  color: var(--color-ink);
  margin: 0 0 var(--space-md);
}

.error-message {
  font: var(--text-body-md);
  color: var(--color-body);
  margin: 0 0 var(--space-2xl);
}

.error-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
}
</style>
