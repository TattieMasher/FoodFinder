<script setup lang="ts">
import { ref, computed } from 'vue'
import RestaurantCard, { type Restaurant } from './RestaurantCard.vue'

interface Props {
  restaurants: Restaurant[]
}

interface Emits {
  (e: 'restaurant-liked', restaurant: Restaurant): void
  (e: 'restaurant-passed', restaurant: Restaurant): void
  (e: 'restaurant-details', restaurant: Restaurant): void
  (e: 'stack-empty'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentIndex = ref(0)
const isAnimating = ref(false)
const topCardRef = ref<InstanceType<typeof RestaurantCard>>()

const visibleCards = computed(() => {
  // Show current card and next 2 cards for stacking effect
  return props.restaurants.slice(currentIndex.value, currentIndex.value + 3)
})

const currentRestaurant = computed(() => {
  return props.restaurants[currentIndex.value]
})

const hasMoreCards = computed(() => {
  return currentIndex.value < props.restaurants.length
})

const remainingCount = computed(() => {
  return Math.max(0, props.restaurants.length - currentIndex.value)
})

const onSwipeLeft = (restaurant: Restaurant) => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  emit('restaurant-passed', restaurant)
}

const onSwipeRight = (restaurant: Restaurant) => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  emit('restaurant-liked', restaurant)
}

const onAnimationComplete = () => {
  currentIndex.value++
  isAnimating.value = false
  
  if (currentIndex.value >= props.restaurants.length) {
    emit('stack-empty')
  }
}

const onTapDetails = (restaurant: Restaurant) => {
  emit('restaurant-details', restaurant)
}

// Action buttons for users who prefer tapping
const likeCurrentRestaurant = () => {
  if (currentRestaurant.value && hasMoreCards.value && !isAnimating.value) {
    topCardRef.value?.swipeRight()
  }
}

const passCurrentRestaurant = () => {
  if (currentRestaurant.value && hasMoreCards.value && !isAnimating.value) {
    topCardRef.value?.swipeLeft()
  }
}
</script>

<template>
  <div class="swipe-container">
    <!-- Progress indicator -->
    <div class="progress-bar">
      <div class="progress-info">
        <span class="remaining-count">{{ remainingCount }} restaurants left</span>
        <span class="progress-fraction">{{ currentIndex + 1 }} / {{ restaurants.length }}</span>
      </div>
      <div class="progress-track">
        <div 
          class="progress-fill"
          :style="{ width: `${((currentIndex) / restaurants.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Card Stack -->
    <div class="card-stack" v-if="hasMoreCards">
      <RestaurantCard
        v-for="(restaurant, index) in visibleCards"
        :key="`${restaurant.id}-${currentIndex + index}`"
        :ref="index === 0 ? 'topCardRef' : undefined"
        :restaurant="restaurant"
        :is-top-card="index === 0"
        @swipe-left="onSwipeLeft"
        @swipe-right="onSwipeRight"
        @tap-details="onTapDetails"
        @animation-complete="onAnimationComplete"
        :style="{ zIndex: visibleCards.length - index }"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <div class="empty-icon">🔄</div>
      <h2>Refreshing...</h2>
      <p>Getting more restaurants for you!</p>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons" v-if="hasMoreCards">
      <button 
        class="action-btn pass-btn"
        @click="passCurrentRestaurant"
        :disabled="isAnimating"
      >
        <span class="btn-icon">👎</span>
        <span class="btn-text">Pass</span>
      </button>

      <button 
        class="action-btn details-btn"
        @click="onTapDetails(currentRestaurant)"
        :disabled="isAnimating"
      >
        <span class="btn-icon">ℹ️</span>
        <span class="btn-text">Info</span>
      </button>

      <button 
        class="action-btn like-btn"
        @click="likeCurrentRestaurant"
        :disabled="isAnimating"
      >
        <span class="btn-icon">❤️</span>
        <span class="btn-text">Like</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.swipe-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  @include respond-to(md) {
    padding: 0.5rem;
  }
}

.progress-bar {
  width: 100%;
  max-width: 350px;
  margin-bottom: 2rem;
  
  @include respond-to(md) {
    max-width: 320px;
    margin-bottom: 1rem;
  }
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-track {
  height: 4px;
  background: rgba(white, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.card-stack {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 600px;
  margin-bottom: 2rem;
  
  @include respond-to(md) {
    max-width: 320px;
    height: 580px;
    margin-bottom: 1.5rem;
  }
  
  // Position all cards absolutely for stacking
  .restaurant-card {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
}

.empty-state {
  text-align: center;
  color: white;
  padding: 4rem 2rem;
  
  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 2rem;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
}

.empty-actions {
  margin-top: 2rem;
}

.refresh-btn {
  @include btn-variant(white, $primary);
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 25px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  max-width: 350px;
  
  @include respond-to(md) {
    max-width: 320px;
    gap: 0.75rem;
  }
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  background: rgba(white, 0.95);
  backdrop-filter: blur(8px);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  .btn-icon {
    font-size: 1.5rem;
  }
  
  .btn-text {
    font-size: 0.9rem;
    color: $dark;
  }
  
  &.pass-btn {
    .btn-text {
      color: $danger;
    }
    
    &:hover:not(:disabled) {
      background: rgba($danger, 0.1);
    }
  }
  
  &.like-btn {
    .btn-text {
      color: $success;
    }
    
    &:hover:not(:disabled) {
      background: rgba($success, 0.1);
    }
  }
  
  &.details-btn {
    .btn-text {
      color: $info;
    }
    
    &:hover:not(:disabled) {
      background: rgba($info, 0.1);
    }
  }
  
  @include respond-to(md) {
    padding: 0.75rem 0.25rem;
    
    .btn-icon {
      font-size: 1.25rem;
    }
    
    .btn-text {
      font-size: 0.8rem;
    }
  }
}

// Add some breathing room at bottom for mobile browsers
@media screen and (max-height: 700px) {
  .swipe-container {
    padding-bottom: 2rem;
  }
}
</style>