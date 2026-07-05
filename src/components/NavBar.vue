<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="navbar-brand">
        <span class="brand-icon">rs</span>
        <span class="brand-text">refacto.rs</span>
      </router-link>
      <div class="navbar-links">
        <router-link to="/" class="nav-link">Exercises</router-link>
        <a
          href="https://github.com/unbalanced-pineapple/refactoring-rust"
          target="_blank"
          rel="noopener noreferrer"
          class="nav-link"
        >
          GitHub
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background: var(--color-canvas);
  border-bottom: 1px solid var(--color-canvas-soft);
}

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-md) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
}

.brand-text {
  font: var(--text-display-sub-sm);
  color: var(--color-ink);
  letter-spacing: -0.6px;
}

.navbar-links {
  display: flex;
  gap: var(--space-lg);
}

.nav-link {
  font: var(--text-body-sm);
  color: var(--color-body);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-ink);
}
</style>
