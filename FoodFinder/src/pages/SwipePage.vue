<script setup lang="ts">
import { ref } from 'vue'
import SwipeContainer from '@/components/SwipeContainer.vue'
import type { Restaurant } from '@/components/RestaurantCard.vue'

// Mock data - this will come from Google Places API later
const mockRestaurants = ref<Restaurant[]>([
  {
    id: 1,
    name: "Mario's Authentic Pizza",
    cuisine: 'Italian',
    rating: 4.8,
    priceRange: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8cGl6emF8fHx8fHwxNzA5NzU4ODk2fA&ixlib=rb-4.0.3&q=80',
    description:
      'Wood-fired pizza made with authentic Italian ingredients. Family-owned since 1952.',
    distance: '0.3 mi',
    openNow: true,
    tags: ['Pizza', 'Family-friendly', 'Takeout'],
    travelTime: '15-20 min',
  },
  {
    id: 2,
    name: 'Sakura Sushi & Ramen',
    cuisine: 'Japanese',
    rating: 4.6,
    priceRange: '$$$',
    imageUrl:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8c3VzaGl8fHx8fHwxNzA5NzU4ODk2fA&ixlib=rb-4.0.3&q=80',
    description:
      'Fresh sushi and authentic ramen in a cozy atmosphere. Chef-owned with daily specials.',
    distance: '0.7 mi',
    openNow: true,
    tags: ['Sushi', 'Ramen', 'Date Night'],
    travelTime: '25-30 min',
  },
  {
    id: 3,
    name: 'Taco Libre Street Food',
    cuisine: 'Mexican',
    rating: 4.4,
    priceRange: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1565299585323-38174c13a5e6?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8dGFjb3N8fHx8fHwxNzA5NzU4ODk2fA&ixlib=rb-4.0.3&q=80',
    description: 'Vibrant street tacos and fresh guacamole made daily. Award-winning margaritas!',
    distance: '0.5 mi',
    openNow: false,
    tags: ['Street Food', 'Vegetarian Options', 'Happy Hour'],
  },
  {
    id: 4,
    name: 'The Burger Lab',
    cuisine: 'American',
    rating: 4.2,
    priceRange: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8YnVyZ2VyfHx8fHx8MTcwOTc1ODg5Nnw&ixlib=rb-4.0.3&q=80',
    description:
      'Gourmet burgers with locally-sourced beef and creative toppings. Craft beer on tap.',
    distance: '1.2 mi',
    openNow: true,
    tags: ['Burgers', 'Craft Beer', 'Late Night'],
    travelTime: '10-15 min',
  },
  {
    id: 5,
    name: 'Pho Saigon Garden',
    cuisine: 'Vietnamese',
    rating: 4.7,
    priceRange: '$',
    imageUrl:
      'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8cGhvfHx8fHx8MTcwOTc1ODg5Nnw&ixlib=rb-4.0.3&q=80',
    description:
      'Traditional Vietnamese pho and fresh spring rolls. Authentic flavors, generous portions.',
    distance: '0.9 mi',
    openNow: true,
    tags: ['Healthy', 'Soup', 'Quick Service'],
  },
  {
    id: 6,
    name: 'Mediterranean Breeze',
    cuisine: 'Mediterranean',
    rating: 4.5,
    priceRange: '$$',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxfDB8MXxyYW5kb218MHx8bWVkaXRlcnJhbmVhbnx8fHx8fDE3MDk3NTg4OTZ8&ixlib=rb-4.0.3&q=80',
    description: 'Fresh Mediterranean cuisine with house-made hummus and grilled meats.',
    distance: '0.8 mi',
    openNow: true,
    tags: ['Healthy', 'Vegetarian', 'Outdoor Seating'],
  },
])

const likedRestaurants = ref<Restaurant[]>([])
const passedRestaurants = ref<Restaurant[]>([])
const showResults = ref(false)

const onRestaurantLiked = (restaurant: Restaurant) => {
  likedRestaurants.value.push(restaurant)
  console.log(`Liked: ${restaurant.name}`)
}

const onRestaurantPassed = (restaurant: Restaurant) => {
  passedRestaurants.value.push(restaurant)
  console.log(`Passed: ${restaurant.name}`)
}

const onRestaurantDetails = (restaurant: Restaurant) => {
  // Navigate to restaurant detail page
  // For now, just log
  console.log(`Show details for: ${restaurant.name}`)
  // router.push(`/restaurant/${restaurant.id}`)
}

const onStackEmpty = () => {
  // Just reset and continue swiping
  resetSwipe()
  console.log('Stack empty - restarting!')
}

const resetSwipe = () => {
  showResults.value = false
  likedRestaurants.value = []
  passedRestaurants.value = []
  // Add some randomization to make it feel fresh
  mockRestaurants.value = [...mockRestaurants.value].sort(() => Math.random() - 0.5)
}
</script>

<template>
  <div class="swipe-page">
    <!-- Header -->
    <div class="swipe-header">
      <h1>🍽️ FoodFinder</h1>
      <p>Find your your true soulmate: your new favourite local restaurant</p>
    </div>

    <!-- Swipe Interface -->
    <SwipeContainer
      :restaurants="mockRestaurants"
      @restaurant-liked="onRestaurantLiked"
      @restaurant-passed="onRestaurantPassed"
      @restaurant-details="onRestaurantDetails"
      @stack-empty="onStackEmpty"
    />
  </div>
</template>

<style scoped lang="scss">
.swipe-page {
  min-height: 100vh;
  @include fade-in();
}

.swipe-header {
  text-align: center;
  padding: 2rem 1rem 0;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  @include respond-to(md) {
    padding: 1rem 0.5rem 0;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }
}
</style>
