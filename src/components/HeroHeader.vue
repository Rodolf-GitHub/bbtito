<template>
  <header class="relative overflow-hidden bg-secondary text-center">
    <div class="absolute inset-0 w-full h-full pointer-events-none z-30">
      <SparkleOverlay />
    </div>
    <div class="relative z-10 mx-auto max-w-4xl px-6 py-5 flex flex-col items-center">
      <nav class="flex flex-col items-center gap-5 text-center w-full">
        <div class="flex flex-col items-center gap-2">
          <div class="relative flex flex-col items-center">
            <div
              class="logo-float flex h-28 w-28 items-center justify-center rounded-full bg-accent shadow-sm sm:h-36 sm:w-36 overflow-hidden z-20 cursor-pointer"
              @click="handleLogoClick"
            >
              <img
                src="/bbtito_logo.png"
                alt="BBTito Logo"
                class="h-full w-full object-contain"
              />
            </div>
          </div>
          <p class="font-display text-3xl font-bold tracking-wide text-foreground sm:text-4xl">BBTito</p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-card/80 p-1.5 text-sm backdrop-blur-sm">
          <a class="rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary" href="#catalogo">Catálogo</a>
          <a class="rounded-full px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-primary" href="#contacto">Contacto</a>
          <button class="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition hover:opacity-90" type="button" @click="$emit('whatsappClick')">WhatsApp</button>
        </div>
      </nav>
      <div class="mt-12 w-full flex flex-col items-center justify-center">
        <div class="flex flex-col gap-5 items-center w-full">
          <p class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm mx-auto">
            Reventa de marcas
            <span class="h-1 w-1 rounded-full bg-primary" />
            Outfits destacados
          </p>
          <h1 class="font-display text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-6xl text-balance text-center">Tu estilo, tu esencia.</h1>
          <p class="max-w-lg text-base text-muted-foreground leading-relaxed text-center">Descubre lo último en moda para mujer y hombre en un solo lugar. Renueva tu guardarropa con las últimas tendencias.</p>
          <div class="flex flex-wrap gap-3 pt-1 justify-center w-full">
            <button
              class="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest shadow-sm transition hover:-translate-y-0.5 hover:shadow-md mx-auto whatsapp-btn-fix"
              type="button"
              @click="$emit('whatsappClick')"
              style="background: var(--primary) !important; color: var(--primary-foreground) !important; border: none !important;"
            >
              Consultar por WhatsApp
            </button>
            <a class="catalogo-btn-fix flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest mx-auto" href="#catalogo">Ver catálogo</a>
          </div>
          <div class="flex gap-8 pt-2 text-sm text-muted-foreground justify-center w-full">
            <div>
              <p class="font-display text-2xl text-foreground">{{ totalMujer }}</p>
              <p>Productos para ella</p>
            </div>
            <div>
              <p class="font-display text-2xl text-foreground">{{ totalHombre }}</p>
              <p>Productos para él</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SparkleOverlay from './SparkleOverlay.vue'
const props = defineProps({
  destacados: Array,
  totalMujer: Number,
  totalHombre: Number,
})
const emit = defineEmits(['whatsappClick', 'imageClick'])
const logoClickCount = ref(0)
let logoTimeout: any = null
function handleLogoClick() {
  logoClickCount.value++
  if (logoTimeout) clearTimeout(logoTimeout)
  logoTimeout = setTimeout(() => {
    logoClickCount.value = 0
  }, 800)
  if (logoClickCount.value === 3) {
    logoClickCount.value = 0
    window.location.href = '/admin/login'
  }
}
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
