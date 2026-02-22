<template>
  <header
    class="relative overflow-hidden bg-gradient-to-b from-secondary via-card to-secondary text-center"
  >
    <div class="absolute inset-0 w-full h-full pointer-events-none z-30">
      <SparkleOverlay />
    </div>
    <div class="relative z-10 mx-auto max-w-5xl px-6 py-10 flex flex-col items-center">
      <nav class="flex flex-col items-center gap-6 text-center w-full">
        <div class="flex flex-col items-center gap-2">
          <div class="relative flex flex-col items-center">
            <div
              class="logo-float flex h-28 w-28 items-center justify-center rounded-full bg-accent shadow-sm sm:h-36 sm:w-36 overflow-hidden z-20 cursor-pointer"
              @click="handleLogoClick"
            >
              <img src="/bbtito_logo.png" alt="BBTito Logo" class="h-full w-full object-contain" />
            </div>
          </div>
          <p class="font-display text-3xl font-bold tracking-wide text-foreground sm:text-4xl">
            BBTito
          </p>
        </div>
        <div class="glass-bar">
          <button
            v-for="filter in filters"
            :key="filter.key"
            type="button"
            class="chip"
            :class="{ active: activeFilter === filter.key }"
            @click="$emit('navFilter', filter.key)"
          >
            {{ filter.label }}
          </button>
          <button type="button" class="chip contact" @click="$emit('whatsappClick')">
            Contacto
          </button>
        </div>
      </nav>
      <div class="mt-12 w-full flex flex-col items-center justify-center">
        <div class="flex flex-col gap-6 items-center w-full">
          <p
            class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-muted-foreground backdrop-blur-sm mx-auto"
          >
            Reventa de marcas
            <span class="h-1 w-1 rounded-full bg-primary" />
            Outfits destacados
          </p>
          <h1
            class="font-display text-4xl leading-[1.15] text-foreground sm:text-5xl lg:text-6xl text-balance text-center"
          >
            Tu estilo, tu esencia.
          </h1>
          <p class="max-w-2xl text-base text-muted-foreground leading-relaxed text-center">
            Descubre lo último en moda para mujer y hombre en un solo lugar. Renueva tu guardarropa
            con las últimas tendencias.
          </p>
          <div class="flex flex-wrap gap-3 pt-2 justify-center w-full">
            <button class="cta primary" type="button" @click="$emit('whatsappClick')">
              Consultar por WhatsApp
            </button>
            <a class="cta ghost" href="#catalogo">Ver catálogo</a>
          </div>
          <div class="flex gap-8 pt-4 text-sm text-muted-foreground justify-center w-full">
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
const props = defineProps<{
  destacados?: any[]
  totalMujer?: number
  totalHombre?: number
  activeFilter?: string
}>()
const emit = defineEmits(['whatsappClick', 'imageClick', 'navFilter'])
const filters = [
  { key: 'todos', label: 'Catálogo' },
  { key: 'ofertas', label: 'Ofertas' },
  { key: 'hombre', label: 'Hombre' },
  { key: 'mujer', label: 'Mujer' },
  { key: 'recientes', label: 'Lo último' },
  { key: 'baratos', label: 'Lo más económico' },
  { key: 'porId', label: 'Por ID' },
]
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

<style scoped>
.glass-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border, #e5e7eb);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}
.chip {
  border-radius: 999px;
  padding: 0.55rem 1.1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--muted-foreground, #666);
  border: 1px solid var(--border, #e5e7eb);
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}
.chip:hover {
  color: var(--primary, #ff2d95);
  border-color: var(--primary, #ff2d95);
  box-shadow: 0 4px 14px rgba(255, 45, 149, 0.12);
}
.chip.active {
  color: #fff;
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  border-color: transparent;
  box-shadow: 0 8px 20px rgba(255, 45, 149, 0.2);
}
.chip.contact {
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px rgba(255, 45, 149, 0.2);
}
.chip.contact:hover {
  filter: brightness(1.05);
}
.cta {
  border-radius: 999px;
  padding: 0.9rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.cta.primary {
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff7abf);
  color: #fff;
  box-shadow: 0 10px 24px rgba(255, 45, 149, 0.25);
  border: none;
}
.cta.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(255, 45, 149, 0.3);
}
.cta.ghost {
  color: var(--primary, #ff2d95);
  border: 1px solid var(--primary, #ff2d95);
  background: transparent;
}
.cta.ghost:hover {
  background: rgba(255, 45, 149, 0.08);
  transform: translateY(-2px);
}

/* Mobile-friendly layout for chips */
@media (max-width: 640px) {
  .glass-bar {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.75rem 0.9rem;
    width: 100%;
    border-radius: 14px;
  }
  .chip {
    width: auto;
    text-align: center;
    padding: 0.55rem 1rem;
  }
}
</style>

<!-- Tailwind CSS classes, no scoped styles needed -->
