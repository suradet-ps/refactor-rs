import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/exercise/:id',
      name: 'exercise',
      component: () => import('@/views/ExerciseView.vue'),
    },
  ],
})

export default router
