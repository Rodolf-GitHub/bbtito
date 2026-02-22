<template>
  <div class="home-page">
    <section v-if="installAvailable" class="install-banner">
      <div class="install-card">
        <div class="install-text">
          <p class="install-title">Instala la app de BBTito</p>
          <p class="install-sub">La experiencia en la tienda es mejor desde la aplicación.</p>
        </div>
        <button class="install-btn" @click="handleInstall">Instalar</button>
      </div>
    </section>
    <HeroHeader
      :destacados="productos"
      :totalMujer="totalMujer"
      :totalHombre="totalHombre"
      @whatsappClick="openWhatsapp"
      @imageClick="openLightbox"
      @navFilter="handleNavFilter"
      @share="shareSite"
    />
    <section id="catalogo" class="catalog-section">
      <div class="catalog-content">
        <div class="catalog-header">
          <div class="catalog-title">
            <span class="catalog-label">Catálogo</span>
            <h2>Nuestros productos</h2>
            <p>
              Explora nuestro catálogo completo. Usa los filtros para encontrar exactamente lo que
              buscas.
            </p>
          </div>
          <div class="catalog-meta">
            <span class="catalog-count">{{ total }} productos</span>
          </div>
        </div>
        <div class="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            v-model="searchQuery"
            @input="onSearchChange"
          />
        </div>
        <div class="filters">
          <button
            v-for="filter in filters"
            :key="filter.key"
            :class="['filter-btn', { active: activeFilter === filter.key }]"
            @click="onFilterChange(filter.key)"
          >
            <component :is="filter.icon" class="filter-icon" />
            {{ filter.label }}
          </button>
        </div>
        <div v-if="isLoading" class="loading">Cargando...</div>
        <div v-else-if="error" class="error">No se pudieron cargar los productos.</div>
        <div v-else-if="productos.length === 0" class="empty">
          <span v-if="searchQuery">No se encontraron productos para "{{ searchQuery }}"</span>
          <span v-else>No hay productos disponibles con este filtro.</span>
        </div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="(producto, index) in productos"
            :key="producto.id ?? index"
            :producto="producto"
            @imageClick="openLightbox"
            @consultar="onConsultar"
          />
        </div>
        <div class="pagination">
          <button :disabled="offset === 0" @click="prevPage">Anterior</button>
          <span
            >Mostrando {{ productos.length }} elementos | Página {{ page }} de
            {{ totalPages }}</span
          >
          <button :disabled="page >= totalPages" @click="nextPage">Siguiente</button>
        </div>
      </div>
    </section>
    <ContactSection />
    <SiteFooter />
    <WhatsappFab @click="openWhatsapp" />
    <WhatsappSelector :isOpen="whatsappOpen" @close="closeWhatsapp" :producto="productoConsulta" />
    <ImageLightbox
      v-if="lightbox"
      :src="lightbox?.src"
      :alt="lightbox?.alt"
      @close="closeLightbox"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
function handleNavFilter(filterKey: string) {
  activeFilter.value = filterKey
  offset.value = 0
  fetchData()
  nextTick(() => {
    const catalogo = document.getElementById('catalogo')
    if (catalogo) {
      catalogo.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
}
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import HeroHeader from '../components/HeroHeader.vue'
import ProductCard from '../components/ProductCard.vue'
import ContactSection from '../components/ContactSection.vue'
import SiteFooter from '../components/SiteFooter.vue'
import WhatsappSelector from '../components/WhatsappSelector.vue'
import WhatsappFab from '../components/WhatsappFab.vue'
import ImageLightbox from '../components/ImageLightbox.vue'
import { fetchProductos, API_ENDPOINTS } from '../api'
import {
  ShoppingBag,
  Tag,
  Heart,
  User,
  Clock,
  ArrowDownNarrowWide,
  Search,
  Share2,
} from 'lucide-vue-next'
import { productosApiGetProducto } from '../api/generated'
import type { ProductoSchema } from '../api/schemas'

const filters = [
  { key: 'todos', label: 'Todos', icon: ShoppingBag, endpoint: API_ENDPOINTS.listarTodos },
  { key: 'ofertas', label: 'Ofertas', icon: Tag, endpoint: API_ENDPOINTS.listarOfertas },
  { key: 'mujer', label: 'Mujer', icon: Heart, endpoint: API_ENDPOINTS.listarMujer },
  { key: 'hombre', label: 'Hombre', icon: User, endpoint: API_ENDPOINTS.listarHombre },
  { key: 'recientes', label: 'Recientes', icon: Clock, endpoint: API_ENDPOINTS.loMasActualizado },
  {
    key: 'baratos',
    label: 'Mas baratos',
    icon: ArrowDownNarrowWide,
    endpoint: API_ENDPOINTS.loMasBarato,
  },
  { key: 'porId', label: 'Por ID', icon: Search, endpoint: API_ENDPOINTS.obtenerProducto },
]

const activeFilter = ref('todos')
const searchQuery = ref('')
const offset = ref(0)
const productos = ref<ProductoSchema[]>([])
const total = ref(0)
const isLoading = ref(false)
const error = ref(false)
const installAvailable = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null
const PAGE_SIZE = 50
const page = computed(() => Math.floor(offset.value / PAGE_SIZE) + 1)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const lightbox = ref<{ src: string; alt: string } | null>(null)
const whatsappOpen = ref(false)
const productoConsulta = ref(undefined)
const totalMujer = ref(0)
const totalHombre = ref(0)

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const fetchData = async () => {
  isLoading.value = true
  error.value = false
  try {
    const currentFilter = filters.find((f) => f.key === activeFilter.value)
    if (!currentFilter) {
      productos.value = []
      total.value = 0
      return
    }
    if (currentFilter?.key === 'porId') {
      const trimmed = searchQuery.value.trim()
      if (!trimmed) {
        productos.value = []
        total.value = 0
        return
      }
      const id = Number(trimmed)
      if (Number.isNaN(id)) {
        productos.value = []
        total.value = 0
        return
      }
      const response = await productosApiGetProducto(id)
      const producto = (response as any)?.data as ProductoSchema | undefined
      productos.value = producto ? [producto] : []
      total.value = productos.value.length
      offset.value = 0
      return
    }
    let endpoint = ''
    if (searchQuery.value) {
      endpoint = `${currentFilter.endpoint}?busqueda=${encodeURIComponent(searchQuery.value)}&limit=50&offset=${offset.value}`
    } else {
      endpoint = `${currentFilter.endpoint}?limit=50&offset=${offset.value}`
    }
    const data = await fetchProductos(endpoint)
    productos.value = data.items
    total.value = data.count
  } catch (e) {
    error.value = true
  } finally {
    isLoading.value = false
  }
}

const fetchTotals = async () => {
  try {
    const mujerData = await fetchProductos(API_ENDPOINTS.listarMujer)
    const hombreData = await fetchProductos(API_ENDPOINTS.listarHombre)
    totalMujer.value = mujerData.count
    totalHombre.value = hombreData.count
  } catch {}
}

onMounted(() => {
  fetchData()
  fetchTotals()
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})

function onFilterChange(filterKey: string) {
  activeFilter.value = filterKey
  offset.value = 0
  fetchData()
}
function onSearchChange() {
  offset.value = 0
  fetchData()
}
function onBeforeInstallPrompt(event: Event) {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  installAvailable.value = true
}
async function handleInstall() {
  if (!deferredPrompt) return
  await deferredPrompt.prompt()
  await deferredPrompt.userChoice
  deferredPrompt = null
  installAvailable.value = false
}
function prevPage() {
  if (offset.value > 0) {
    offset.value = Math.max(0, offset.value - PAGE_SIZE)
    fetchData()
  }
}
function nextPage() {
  if (page.value < totalPages.value) {
    offset.value += PAGE_SIZE
    fetchData()
  }
}
function openLightbox(src: string, alt: string) {
  lightbox.value = { src, alt }
}
function closeLightbox() {
  lightbox.value = null
}
function openWhatsapp(producto?: any) {
  if (producto) {
    productoConsulta.value = producto
  } else {
    productoConsulta.value = undefined
  }
  whatsappOpen.value = true
}
function closeWhatsapp() {
  whatsappOpen.value = false
  productoConsulta.value = undefined
}
function onConsultar(producto: any) {
  openWhatsapp(producto)
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

async function shareSite() {
  const url = window.location.origin
  const title = 'BBTito - Moda que encanta'
  const text = 'Descubre las últimas prendas en BBTito. ¡Te va a encantar!'
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

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
}

.install-banner {
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem;
}
.install-card {
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(135deg, rgba(255, 45, 149, 0.08), rgba(255, 255, 255, 0.9));
  border: 1px solid var(--border, #eee);
  border-radius: 18px;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  box-shadow: 0 12px 35px rgba(255, 45, 149, 0.08);
  backdrop-filter: blur(6px);
}
.install-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: left;
}
.install-title {
  font-weight: 800;
  color: var(--foreground);
  font-size: 1rem;
}
.install-sub {
  color: var(--muted-foreground);
  font-size: 0.9rem;
}
.install-btn {
  border: none;
  border-radius: 999px;
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  color: #fff;
  font-weight: 700;
  padding: 0.7rem 1.4rem;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(255, 45, 149, 0.25);
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;
}
.install-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 32px rgba(255, 45, 149, 0.3);
}
.install-btn:active {
  transform: translateY(0);
}
@media (max-width: 640px) {
  .install-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
  }
  .install-text {
    text-align: left;
  }
  .install-btn {
    width: 100%;
    text-align: center;
  }
}

/* Centrar el contenido del hero en desktop */
@media (min-width: 1024px) {
  .hero-header .lg\:grid-cols-\[1\.1fr_0\.9fr\] {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
  }
  .hero-header .flex.flex-col.gap-5 {
    align-items: center;
    text-align: center;
  }
}

.catalog-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}
.catalog-content {
  background: var(--card-bg, #fff8fa);
  border-radius: 1rem;
  border: 1px solid var(--border, #eee);
  padding: 0.5rem 0.25rem;
  text-align: center;
  margin-left: 0;
  margin-right: 0;
}
@media (min-width: 640px) {
  .catalog-content {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .catalog-content {
    padding-left: 1rem;
    padding-right: 1rem;
    border-radius: 2rem;
  }
}
.catalog-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}
.catalog-title {
  text-align: center;
}
.catalog-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.catalog-label {
  color: var(--primary);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.catalog-count {
  color: var(--muted-foreground);
  font-size: 0.8rem;
  text-transform: uppercase;
}
.share-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid var(--border, #e5e5e5);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #fff;
  color: var(--foreground);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}
.share-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.08);
  background: #f9f9fb;
}
.share-icon {
  width: 16px;
  height: 16px;
}
@media (min-width: 768px) {
  .catalog-header {
    flex-direction: row;
    align-items: center;
  }
  .catalog-title {
    text-align: left;
  }
}
.search-bar {
  margin: 1rem 0;
  position: relative;
}
.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border, #eee);
  font-size: 1rem;
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: 1px solid var(--border, #eee);
  background: var(--background, #fff);
  color: var(--muted-foreground, #888);
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn.active {
  background: var(--primary, #ff2d95);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 45, 149, 0.08);
}
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 1.5rem;
}
@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.loading,
.error,
.empty {
  margin: 2rem 0;
  color: var(--muted-foreground, #888);
}
.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 0 0;
}
.pagination button {
  border-radius: 999px;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  background: var(--primary, #ff2d95);
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.pagination button:disabled {
  background: var(--muted, #eee);
  color: var(--muted-foreground, #888);
  cursor: not-allowed;
}
</style>
