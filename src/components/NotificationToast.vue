<template>
  <div class="notification-root">
    <div v-for="t in toasts" :key="t.id" :class="['toast', t.type]">
      <div class="toast-message">{{ t.message }}</div>
      <button class="toast-close" @click="remove(t.id)">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useNotification from '../composables/useNotification'

const { toasts, remove } = useNotification()
const localToasts = computed(() => toasts)
</script>

<style scoped>
.notification-root {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.toast {
  min-width: 220px;
  max-width: 340px;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}
.toast.success {
  background: #16a34a;
}
.toast.error {
  background: #dc2626;
}
.toast.info {
  background: #2563eb;
}
.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  cursor: pointer;
}
.toast-message {
  margin-right: 0.5rem;
  flex: 1;
}
</style>
