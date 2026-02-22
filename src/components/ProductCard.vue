<template>
  <article
    class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md text-center"
  >
    <div class="relative aspect-[3/4] overflow-hidden bg-secondary">
      <img
        v-if="imgSrc"
        :src="imgSrc"
        :alt="producto.nombre"
        class="h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        @click="onImageClick"
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
        <div class="flex gap-2 w-full justify-center items-center">
          <button
            type="button"
            class="rounded-full border border-primary px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-primary transition hover:bg-primary hover:text-primary-foreground w-full max-w-[200px] consultar-btn-fix"
            @click="$emit('consultar', producto)"
          >
            Consultar
          </button>
          <button
            type="button"
            class="rounded-full border border-border bg-card p-2 text-muted-foreground hover:text-primary hover:border-primary transition shadow-sm"
            aria-label="Compartir producto"
            title="Compartir producto"
            @click="shareProducto"
          >
            <Share2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Tag, Share2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { buildImageUrl } from '../api'
const props = defineProps({
  producto: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  navigateOnClick: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const emit = defineEmits(['imageClick', 'consultar'])
const imgSrc = computed(() =>
  props.producto && props.producto.imagen ? buildImageUrl(props.producto.imagen) : '',
)
const displayPrice = computed(() => {
  const raw = Number((props.producto as any)?.precio ?? 0)
  if (Number.isNaN(raw)) return 0
  return Math.floor(raw)
})
const router = useRouter()

function goToDetail() {
  if (!props.producto?.id) return
  router.push({ path: `/producto/${props.producto.id}` })
}

function onImageClick() {
  if (!imgSrc.value) return
  if (props.navigateOnClick) {
    goToDetail()
  } else {
    emit('imageClick', imgSrc.value, props.producto?.nombre || '')
  }
}

function copyFallback(url: string) {
  const input = document.createElement('input')
  input.value = url
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  alert('Enlace copiado')
}

async function shareProducto() {
  const url = `${window.location.origin}/producto/${props.producto?.id}`
  const title = props.producto?.nombre || 'Producto BBTito'
  const text = 'Mira este producto que encontré en BBTito'
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url })
      return
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      alert('Enlace copiado')
      return
    }
    copyFallback(url)
  } catch (e) {
    copyFallback(url)
  }
}
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
