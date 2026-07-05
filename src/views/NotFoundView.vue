<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-code">404</div>
      <h1 class="not-found-title">Page not found</h1>
      <p class="not-found-message">The page you're looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn btn-primary">Back to exercises</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: var(--space-xl);
}

.not-found-content {
  text-align: center;
}

.not-found-code {
  font: var(--text-display-xl);
  color: var(--color-mute);
  margin-bottom: var(--space-lg);
}

.not-found-title {
  font: var(--text-display-md);
  color: var(--color-ink);
  margin: 0 0 var(--space-md);
}

.not-found-message {
  font: var(--text-body-md);
  color: var(--color-body);
  margin: 0 0 var(--space-2xl);
}
</style>
