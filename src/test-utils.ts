import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export function createTestRouter(routes: RouteRecordRaw[] = []) {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/exercise/:id', name: 'exercise', component: { template: '<div>Exercise</div>' } },
      { path: '/:pathMatch(.*)*', name: 'not-found', component: { template: '<div>404</div>' } },
      ...routes,
    ],
  })
}
