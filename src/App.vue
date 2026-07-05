<template>
  <div class="app">
    <NavBar />
    <main class="app-main">
      <ErrorBoundary>
        <router-view />
      </ErrorBoundary>
    </main>
  </div>
</template>

<script setup lang="ts">
import ErrorBoundary from '@/components/ErrorBoundary.vue'
import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
