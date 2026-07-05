import { createRouter, createWebHistory } from 'vue-router'
import ExerciseView from '@/views/ExerciseView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/exercise/:id',
      name: 'exercise',
      component: ExerciseView,
    },
  ],
})

export default router
