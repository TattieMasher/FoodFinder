import { createRouter, createWebHistory } from 'vue-router'
import SwipePage from '@/pages/SwipePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'swipe',
      component: SwipePage,
      meta: {
        title: 'FoodFinder - Discover Restaurants'
      }
    },
    // Redirect all other routes to swipe
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

// Navigation guard to update page title
router.beforeEach((to) => {
  document.title = to.meta?.title as string || 'FoodFinder'
})

export default router
