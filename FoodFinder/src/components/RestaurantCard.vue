<script setup lang="ts">
import { ref, computed } from 'vue'

export interface Restaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  priceRange: string
  imageUrl: string
  description: string
  distance: string
  openNow: boolean
  tags: string[]
  travelTime?: string
}

interface Props {
  restaurant: Restaurant
  isTopCard?: boolean
}

interface Emits {
  (e: 'swipe-left', restaurant: Restaurant): void
  (e: 'swipe-right', restaurant: Restaurant): void
  (e: 'tap-details', restaurant: Restaurant): void
  (e: 'animation-complete'): void
}

const props = withDefaults(defineProps<Props>(), {
  isTopCard: false,
})

const emit = defineEmits<Emits>()

// Touch/swipe handling
const isDragging = ref(false)
const isExiting = ref(false)
const exitDirection = ref<'left' | 'right' | null>(null)
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const cardRef = ref<HTMLElement>()
const imageError = ref(false)
const imageLoaded = ref(false)

const swipeThreshold = 100
const rotationMultiplier = 0.1

// Image handling
const getImageSrc = computed(() => {
  if (imageError.value) {
    return 'https://via.placeholder.com/400x300/f0f0f0/666?text=Restaurant+Image'
  }

  // Use real image URL if it exists and looks valid
  if (
    props.restaurant.imageUrl &&
    (props.restaurant.imageUrl.startsWith('http') || props.restaurant.imageUrl.startsWith('data:'))
  ) {
    return props.restaurant.imageUrl
  }

  // Default placeholder for invalid/missing URLs
  return 'https://via.placeholder.com/400x300/667eea/white?text=🍽️+Restaurant'
})

const onImageError = () => {
  if (!imageError.value) {
    imageError.value = true
  }
}

const onImageLoad = () => {
  imageLoaded.value = true
}

const cardTransform = computed(() => {
  if (isExiting.value) {
    const direction = exitDirection.value === 'right' ? 1 : -1
    return `translate(${direction * window.innerWidth * 1.5}px, ${Math.random() * 100 - 50}px) rotate(${direction * 45}deg) scale(0.8)`
  }

  if (!isDragging.value) return 'translate(0px, 0px) rotate(0deg) scale(1)'

  const deltaX = currentX.value - startX.value
  const deltaY = currentY.value - startY.value
  const rotation = deltaX * rotationMultiplier
  const scale = Math.max(0.95, 1 - Math.abs(deltaX) / 1000)

  return `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg) scale(${scale})`
})

const cardOpacity = computed(() => {
  if (isExiting.value) return 0
  if (!isDragging.value) return 1
  const deltaX = Math.abs(currentX.value - startX.value)
  return Math.max(0.7, 1 - deltaX / 300)
})

const showLikeOverlay = computed(() => {
  return isDragging.value && currentX.value - startX.value > 50
})

const showPassOverlay = computed(() => {
  return isDragging.value && currentX.value - startX.value < -50
})

// Touch events
const onTouchStart = (event: TouchEvent) => {
  if (!props.isTopCard) return

  isDragging.value = true
  const touch = event.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  currentX.value = touch.clientX
  currentY.value = touch.clientY
}

const onTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || !props.isTopCard) return

  event.preventDefault()
  const touch = event.touches[0]
  currentX.value = touch.clientX
  currentY.value = touch.clientY
}

const onTouchEnd = () => {
  if (!isDragging.value || !props.isTopCard || isExiting.value) return

  const deltaX = currentX.value - startX.value

  if (Math.abs(deltaX) > swipeThreshold) {
    // Start exit animation
    isExiting.value = true
    exitDirection.value = deltaX > 0 ? 'right' : 'left'

    // Emit the swipe event
    setTimeout(() => {
      if (deltaX > 0) {
        emit('swipe-right', props.restaurant)
      } else {
        emit('swipe-left', props.restaurant)
      }
    }, 100)

    // Complete animation after delay
    setTimeout(() => {
      emit('animation-complete')
    }, 600)
  } else {
    // Reset if not swiped far enough
    isDragging.value = false
    currentX.value = 0
    currentY.value = 0
  }
}

// Mouse events for desktop testing
const onMouseDown = (event: MouseEvent) => {
  if (!props.isTopCard) return

  isDragging.value = true
  startX.value = event.clientX
  startY.value = event.clientY
  currentX.value = event.clientX
  currentY.value = event.clientY
}

const onMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !props.isTopCard) return

  event.preventDefault()
  currentX.value = event.clientX
  currentY.value = event.clientY
}

const onMouseUp = () => {
  if (!isDragging.value || !props.isTopCard || isExiting.value) return

  const deltaX = currentX.value - startX.value

  if (Math.abs(deltaX) > swipeThreshold) {
    // Start exit animation
    isExiting.value = true
    exitDirection.value = deltaX > 0 ? 'right' : 'left'

    // Emit the swipe event
    setTimeout(() => {
      if (deltaX > 0) {
        emit('swipe-right', props.restaurant)
      } else {
        emit('swipe-left', props.restaurant)
      }
    }, 100)

    // Complete animation after delay
    setTimeout(() => {
      emit('animation-complete')
    }, 600)
  } else {
    // Reset if not swiped far enough
    isDragging.value = false
    currentX.value = 0
    currentY.value = 0
  }
}

const onCardTap = () => {
  if (!isDragging.value && !isExiting.value) {
    emit('tap-details', props.restaurant)
  }
}

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '⭐'.repeat(fullStars)
  if (hasHalfStar) stars += '⭐'
  return stars
}

// Add programmatic swipe functions for button actions
const swipeLeft = () => {
  if (isExiting.value || !props.isTopCard) return

  isExiting.value = true
  exitDirection.value = 'left'

  setTimeout(() => {
    emit('swipe-left', props.restaurant)
  }, 100)

  setTimeout(() => {
    emit('animation-complete')
  }, 600)
}

const swipeRight = () => {
  if (isExiting.value || !props.isTopCard) return

  isExiting.value = true
  exitDirection.value = 'right'

  setTimeout(() => {
    emit('swipe-right', props.restaurant)
  }, 100)

  setTimeout(() => {
    emit('animation-complete')
  }, 600)
}

// Expose functions for parent component
defineExpose({
  swipeLeft,
  swipeRight,
})
</script>

<template>
  <div
    ref="cardRef"
    class="restaurant-card"
    :class="{
      'is-top-card': isTopCard,
      'is-dragging': isDragging,
      'is-exiting': isExiting,
      'exit-left': isExiting && exitDirection === 'left',
      'exit-right': isExiting && exitDirection === 'right',
    }"
    :style="{
      transform: cardTransform,
      opacity: cardOpacity,
      zIndex: isTopCard ? 10 : 1,
    }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @click="onCardTap"
  >
    <!-- Swipe Overlays -->
    <div class="swipe-overlay like-overlay" :class="{ visible: showLikeOverlay }">
      <div class="overlay-content">
        <div class="overlay-icon">❤️</div>
        <div class="overlay-text">LIKE</div>
      </div>
    </div>

    <div class="swipe-overlay pass-overlay" :class="{ visible: showPassOverlay }">
      <div class="overlay-content">
        <div class="overlay-icon">👎</div>
        <div class="overlay-text">PASS</div>
      </div>
    </div>

    <!-- Restaurant Image -->
    <div class="card-image">
      <img
        :src="getImageSrc"
        :alt="restaurant.name"
        @error="onImageError"
        @load="onImageLoad"
        :class="{ loaded: imageLoaded }"
      />

      <!-- Loading placeholder -->
      <div v-if="!imageLoaded && !imageError" class="image-loading">
        <div class="loading-spinner">🍽️</div>
      </div>

      <!-- Status badges -->
      <div class="image-badges">
        <div class="status-badge" :class="restaurant.openNow ? 'open' : 'closed'">
          {{ restaurant.openNow ? 'Open Now' : 'Closed' }}
        </div>

        <div v-if="restaurant.estimatedWaitTime" class="wait-time-badge">
          {{ restaurant.estimatedWaitTime }}
        </div>
      </div>
    </div>

    <!-- Restaurant Info -->
    <div class="card-content">
      <!-- Header with name and distance -->
      <div class="card-header">
        <h2 class="restaurant-name">{{ restaurant.name }}</h2>
        <span class="distance">{{ restaurant.distance }}</span>
      </div>

      <!-- Rating and price -->
      <div class="rating-price">
        <div class="rating">
          <span class="stars">{{ renderStars(restaurant.rating) }}</span>
          <span class="rating-number">{{ restaurant.rating }}</span>
        </div>
        <div class="price-range">{{ restaurant.priceRange }}</div>
      </div>

      <!-- Cuisine and description -->
      <div class="cuisine-type">{{ restaurant.cuisine }}</div>
      <p class="description">{{ restaurant.description }}</p>

      <!-- Tags -->
      <div class="tags">
        <span v-for="tag in restaurant.tags.slice(0, 3)" :key="tag" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Action hint for top card -->
    <div v-if="isTopCard" class="swipe-hint">
      <div class="hint-arrow left">👈 Pass</div>
      <div class="hint-text">Swipe to decide</div>
      <div class="hint-arrow right">Like 👉</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.restaurant-card {
  position: relative;
  width: 100%;
  max-width: 350px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

  &.is-top-card {
    cursor: grab;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

    &.is-dragging {
      cursor: grabbing;
      transition: none;
    }
  }

  &.is-exiting {
    pointer-events: none;
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 100 !important;

    &.exit-left {
      filter: hue-rotate(-20deg) brightness(0.8);
    }

    &.exit-right {
      filter: hue-rotate(20deg) brightness(1.1) saturate(1.2);
    }

    // Add particle effect overlay
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background:
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.8) 2px, transparent 2px),
        radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.6) 1px, transparent 1px),
        radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.7) 1.5px, transparent 1.5px),
        radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
        radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.6) 1.5px, transparent 1.5px);
      background-size:
        50px 50px,
        30px 30px,
        40px 40px,
        60px 60px,
        35px 35px;
      animation: sparkle 0.6s ease-out;
      pointer-events: none;
      opacity: 0;
    }

    // Show sparkles during exit
    &.exit-left::after,
    &.exit-right::after {
      opacity: 1;
    }
  }

  // Stack effect for cards behind
  &:not(.is-top-card):not(.is-exiting) {
    transform: scale(0.95) translateY(10px);
    opacity: 0.8;
  }

  @include respond-to(md) {
    max-width: 320px;
    height: 580px;
  }
}

.swipe-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 5;

  &.visible {
    opacity: 1;
  }

  .overlay-content {
    text-align: center;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .overlay-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .overlay-text {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 2px;
  }

  &.like-overlay {
    background: rgba($success, 0.85);
  }

  &.pass-overlay {
    background: rgba($danger, 0.85);
  }
}

.card-image {
  position: relative;
  height: 60%;
  overflow: hidden;
  background:
    linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
    linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    0 10px,
    10px -10px,
    -10px 0px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
    opacity: 0;

    &.loaded {
      opacity: 1;
    }
  }

  .restaurant-card:hover & img {
    transform: scale(1.05);
  }
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .loading-spinner {
    font-size: 3rem;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.image-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(8px);

  &.open {
    background: rgba($success, 0.9);
    color: white;
  }

  &.closed {
    background: rgba($danger, 0.9);
    color: white;
  }
}

.wait-time-badge {
  padding: 0.5rem 1rem;
  background: rgba(black, 0.7);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(8px);
}

.card-content {
  padding: 1.5rem;
  height: 40%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.restaurant-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: $dark;
  margin: 0;
  line-height: 1.2;
  flex: 1;
  min-width: 0; // Allow text truncation
  @include text-truncate;
}

.distance {
  font-size: 0.875rem;
  color: $secondary;
  font-weight: 600;
  white-space: nowrap;
}

.rating-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .stars {
    font-size: 1rem;
  }

  .rating-number {
    font-weight: 600;
    color: $warning;
  }
}

.price-range {
  font-size: 1.1rem;
  font-weight: 700;
  color: $success;
}

.cuisine-type {
  font-size: 1rem;
  font-weight: 600;
  color: $info;
}

.description {
  font-size: 0.9rem;
  color: $secondary;
  line-height: 1.4;
  margin: 0;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.tag {
  padding: 0.25rem 0.75rem;
  background: rgba($primary, 0.1);
  color: $primary;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.swipe-hint {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(white, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  font-size: 0.8rem;
  color: $secondary;
  animation: pulse 2s infinite;
}

.hint-text {
  font-weight: 600;
  color: $dark;
}

.hint-arrow {
  font-weight: 600;

  &.left {
    color: $danger;
  }

  &.right {
    color: $success;
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

@keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) rotate(360deg);
  }
}

// Mobile optimizations
@media (max-width: 375px) {
  .restaurant-card {
    height: 550px;
  }

  .card-content {
    padding: 1.25rem;
  }

  .restaurant-name {
    font-size: 1.3rem;
  }
}
</style>
