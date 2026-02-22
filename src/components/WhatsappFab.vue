<template>
  <button
    class="fixed bottom-6 right-6 z-[90] flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-md transition-shadow hover:shadow-lg"
    aria-label="WhatsApp"
    type="button"
    @click="$emit('click')"
  >
    <IconWhatsapp class="h-10 w-10 text-primary-foreground" />
  </button>
</template>

<script setup lang="ts">
import IconWhatsapp from './icons/IconWhatsapp.vue'
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
