<template>
  <div class="home-page">
    <HeroHeader
      :destacados="productos"
      :totalMujer="totalMujer"
      :totalHombre="totalHombre"
      @whatsappClick="openWhatsapp"
      @imageClick="openLightbox"
      @navFilter="handleNavFilter"
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
          <span class="catalog-count">{{ total }} productos</span>
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
            v-for="producto in productos"
            :key="producto.id"
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
    <ImageLightbox v-if="lightbox" :src="lightbox.src" :alt="lightbox.alt" @close="closeLightbox" />
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
function handleNavFilter(filterKey) {
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
import { ref, computed, onMounted } from 'vue'
import HeroHeader from '../components/HeroHeader.vue'
import ProductCard from '../components/ProductCard.vue'
import ContactSection from '../components/ContactSection.vue'
import SiteFooter from '../components/SiteFooter.vue'
import WhatsappSelector from '../components/WhatsappSelector.vue'
import WhatsappFab from '../components/WhatsappFab.vue'
import ImageLightbox from '../components/ImageLightbox.vue'
import { fetchProductos, API_ENDPOINTS } from '../api'
import { ShoppingBag, Tag, Heart, User, Clock, ArrowDownNarrowWide, Search } from 'lucide-vue-next'

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
]

const activeFilter = ref('todos')
const searchQuery = ref('')
const offset = ref(0)
const productos = ref([])
const total = ref(0)
const isLoading = ref(false)
const error = ref(false)
const PAGE_SIZE = 50
const page = computed(() => Math.floor(offset.value / PAGE_SIZE) + 1)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))
const lightbox = ref(null)
const whatsappOpen = ref(false)
const productoConsulta = ref(undefined)
const totalMujer = ref(0)
const totalHombre = ref(0)

const fetchData = async () => {
  isLoading.value = true
  error.value = false
  try {
    const currentFilter = filters.find((f) => f.key === activeFilter.value)
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
  productoConsulta.value = producto
  whatsappOpen.value = true
}
function closeWhatsapp() {
  whatsappOpen.value = false
  productoConsulta.value = undefined
}
function onConsultar(producto: any) {
  openWhatsapp(producto)
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
