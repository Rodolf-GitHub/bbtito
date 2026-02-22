<template>
  <article
    class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md text-center"
  >
    <div class="relative aspect-[3/4] overflow-hidden bg-secondary">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="producto.nombre"
        class="h-full w-full cursor-zoom-in object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        @click="$emit('imageClick', imgSrc, producto.nombre)"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-sm text-muted-foreground"
      >
        Sin imagen
      </div>
      <span
        v-if="producto.en_oferta"
        class="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground"
      >
        <Tag class="h-3 w-3" /> Oferta
      </span>
      <span
        class="absolute right-2.5 top-2.5 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-sm"
      >
        #{{ producto.id }}
      </span>
      <span
        class="absolute bottom-2.5 right-2.5 rounded-full bg-card/90 px-2 py-0.5 text-[12px] font-bold text-primary backdrop-blur-sm border border-primary"
      >
        {{ producto.para_mujer ? 'Mujer' : 'Hombre' }}
      </span>
    </div>
    <div class="flex flex-col gap-2.5 p-3.5">
      <p class="text-base font-bold text-foreground line-clamp-2 leading-snug mx-auto">
        {{ producto.nombre }}
      </p>
      <div class="flex flex-col items-center gap-2">
        <p class="text-xl font-bold text-primary">${{ displayPrice }}</p>
        <button
          type="button"
          class="rounded-full border border-primary px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground w-full max-w-[140px] consultar-btn-fix"
          @click="$emit('consultar', producto)"
        >
          Consultar
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Tag } from 'lucide-vue-next'
import { buildImageUrl } from '../api'
const props = defineProps({
  producto: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})
const imgSrc = computed(() =>
  props.producto && props.producto.imagen ? buildImageUrl(props.producto.imagen) : '',
)
const displayPrice = computed(() => {
  const raw = Number((props.producto as any)?.precio ?? 0)
  if (Number.isNaN(raw)) return 0
  return Math.floor(raw)
})
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
