<template>
  <div v-if="src" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" @click.self="$emit('close')">
    <div class="relative max-w-2xl w-full">
      <button class="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-black hover:bg-white" @click="$emit('close')" aria-label="Cerrar">
        <X class="h-6 w-6" />
      </button>
      <img :src="src" :alt="alt" class="w-full h-auto rounded-xl shadow-lg object-contain bg-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'
const props = defineProps({
  src: String,
  alt: String
})
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
