<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; value: string | number }>()
</script>

<style scoped>
.stat-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  min-width: 120px;
  min-height: 80px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.03);
}
.stat-label {
  font-size: 0.95rem;
  color: var(--muted-foreground);
  margin-bottom: 0.5rem;
}
.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
}
</style>
