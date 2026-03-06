<script setup lang="ts">
// Pure swipe app - no navigation needed
</script>

<template>
  <div id="app">
    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
// Global styles
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: $font-family-base;
  line-height: $line-height-base;
  color: $dark;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: 100vh;
}

// Global utility classes
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.mt-1 { margin-top: map-get($spacers, 1); }
.mt-2 { margin-top: map-get($spacers, 2); }
.mt-3 { margin-top: map-get($spacers, 3); }
.mt-4 { margin-top: map-get($spacers, 4); }
.mt-5 { margin-top: map-get($spacers, 5); }

.mb-1 { margin-bottom: map-get($spacers, 1); }
.mb-2 { margin-bottom: map-get($spacers, 2); }
.mb-3 { margin-bottom: map-get($spacers, 3); }
.mb-4 { margin-bottom: map-get($spacers, 4); }
.mb-5 { margin-bottom: map-get($spacers, 5); }
</style>
