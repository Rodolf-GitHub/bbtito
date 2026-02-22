<template>
  <div class="sparkle-container absolute inset-0 w-full h-full pointer-events-none z-1">
    <span
      v-for="(star, i) in stars"
      :key="i"
      :style="starStyle(i)"
    >
      <StarIcon :size="star.size" color="#ff2d95" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { StarIcon } from 'lucide-vue-next'
const stars = Array.from({ length: 12 }, (_, i) => ({
  left: `${6 + i * 8}%`,
  delay: i * 0.8,
  duration: 6 + (i % 3) * 2,
  size: 18 + (i % 3) * 6,
}))
const tick = ref(0)
let interval: any = null
onMounted(() => {
  interval = setInterval(() => tick.value++, 50)
})
onUnmounted(() => {
  clearInterval(interval)
})
function starStyle(i: number) {
  const star = stars[i]
  const progress = ((tick.value / (star.duration * 20)) + star.delay / star.duration) % 1
  const top = `${progress * 100}%`
  return {
    position: 'absolute',
    left: star.left,
    top,
    width: `${star.size}px`,
    height: `${star.size}px`,
    pointerEvents: 'none',
    opacity: progress > 0.05 && progress < 0.95 ? 1 : 0,
    transition: 'opacity 0.2s',
  }
}
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
