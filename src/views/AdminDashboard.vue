<template>
  <div class="min-h-screen flex flex-col justify-center w-full bg-secondary">
    <div class="mx-auto w-full py-8 px-2 sm:px-6 lg:px-24 gap-6 flex flex-col">
      <div class="flex flex-col items-center text-center gap-3 mb-4">
        <a
          href="/"
          class="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 px-5 py-2 text-primary font-semibold shadow-sm backdrop-blur hover:-translate-y-0.5 hover:shadow-md transition-all"
        >
          <span class="text-lg">←</span>
          <span>Volver a la tienda</span>
        </a>
        <div class="flex flex-col gap-1 items-center">
          <h1 class="font-display text-3xl font-bold text-foreground">Productos</h1>
          <p class="text-sm text-muted-foreground max-w-xl">
            Gestiona tu catálogo de productos desde aquí.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" :value="total" icon="📦" />
        <StatCard label="Ofertas" :value="totalOfertas" icon="🏷️" />
        <StatCard label="Mujer" :value="totalMujer" icon="F" />
        <StatCard label="Hombre" :value="totalHombre" icon="M" />
      </div>

      <div>
        <div class="catalog-content">
          <div class="catalog-header">
            <div class="catalog-title">
              <span class="catalog-label">Catálogo</span>
              <h2>Administrar productos</h2>
              <p>
                Explora y administra el catálogo. Usa los filtros para encontrar exactamente lo que
                buscas.
              </p>
            </div>
            <span class="catalog-count">{{ total }} productos</span>
          </div>
          <div class="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              v-model="busqueda"
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
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <button
              @click="openCreateModal"
              class="h-10 rounded-xl gap-2 bg-primary text-primary-foreground flex items-center justify-center px-4 font-semibold"
            >
              <span>➕</span> Nuevo producto
            </button>
          </div>

          <div v-if="isLoading" class="loading">Cargando...</div>
          <div v-else-if="error" class="error">No se pudieron cargar los productos.</div>
          <div v-else-if="productos.length === 0" class="empty">
            <span v-if="busqueda">No se encontraron productos para "{{ busqueda }}"</span>
            <span v-else>No hay productos disponibles con este filtro.</span>
          </div>
          <div v-else>
            <ProductTable :productos="productos" @edit="openEditModal" @delete="onDelete" />
          </div>

          <div class="pagination">
            <button :disabled="offset === 0" @click="prevPage">Anterior</button>
            <span
              >Mostrando {{ productos.length }} elementos | Página {{ page }} de
              {{ totalPages }}</span
            >
            <button :disabled="page >= totalPages" @click="nextPage">Siguiente</button>
          </div>

          <ProductModal
            :open="modalOpen"
            :isEdit="!!selectedProduct"
            :producto="selectedProduct"
            @close="closeModal"
            @save="onSave"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ShoppingBag, Tag, Heart, User, Clock, ArrowDownNarrowWide, Search } from 'lucide-vue-next'
import { API_ENDPOINTS, fetchProductos } from '../api'
import {
  productosApiCreateProducto,
  productosApiUpdateProducto,
  productosApiGetProducto,
} from '../api/generated'
import type { ProductosApiCreateProductoBody, ProductosApiUpdateProductoBody } from '../api/schemas'

import ProductTable from '../components/admin/ProductTable.vue'
import StatCard from '../components/admin/StatCard.vue'
import ProductModal from '../components/admin/ProductModal.vue'
// Modal state
const modalOpen = ref(false)
const selectedProduct = ref<any | null>(null)

function openCreateModal() {
  selectedProduct.value = null
  modalOpen.value = true
}
function openEditModal(product: any) {
  selectedProduct.value = { ...product }
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
  selectedProduct.value = null
}
async function onSave(product: any) {
  console.log('onSave ejecutado', product)
  isLoading.value = true
  error.value = false
  try {
    // Convertir imagen base64 a Blob si aplica
    let imagenBlob: Blob | undefined = undefined
    if (
      product.imagen &&
      typeof product.imagen === 'string' &&
      product.imagen.startsWith('data:')
    ) {
      const arr = product.imagen.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      imagenBlob = new Blob([u8arr], { type: mime })
    }

    if (!selectedProduct.value) {
      const body: ProductosApiCreateProductoBody = {
        data: {
          nombre: product.nombre,
          precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
          para_mujer: product.para_mujer,
          en_oferta: product.en_oferta,
        },
        ...(imagenBlob ? { imagen: imagenBlob } : {}),
      }
      await productosApiCreateProducto(body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bbtito_auth_token')}` },
      })
    } else {
      const body: ProductosApiUpdateProductoBody = {
        data: {
          nombre: product.nombre,
          precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
          para_mujer: product.para_mujer,
          en_oferta: product.en_oferta,
        },
        ...(imagenBlob ? { imagen: imagenBlob } : {}),
      }
      await productosApiUpdateProducto(selectedProduct.value.id, body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bbtito_auth_token')}` },
      })
    }
    closeModal()
    await fetchData()
  } catch (e) {
    error.value = true
    console.error('Error al crear producto:', e)
  } finally {
    isLoading.value = false
  }
}
function onDelete(product: any) {
  // Aquí deberías mostrar confirmación y llamar a la API para eliminar
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    // Llama a la API para eliminar y luego recarga
    fetchData()
  }
}

import { watch } from 'vue'
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
const productos = ref<ProductoSchema[]>([])
const total = ref(0)
const totalOfertas = ref(0)
const totalMujer = ref(0)
const totalHombre = ref(0)
const busqueda = ref('')
const offset = ref(0)
const isLoading = ref(false)
const error = ref(false)
const PAGE_SIZE = 50
const page = computed(() => Math.floor(offset.value / PAGE_SIZE) + 1)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

function onSearchChange() {
  offset.value = 0
  fetchData()
}
function onFilterChange(filterKey: string) {
  activeFilter.value = filterKey
  offset.value = 0
  fetchData()
}

async function fetchData() {
  isLoading.value = true
  error.value = false
  try {
    const currentFilter = filters.find((f) => f.key === activeFilter.value)
    if (!currentFilter) {
      productos.value = []
      total.value = 0
      totalOfertas.value = 0
      totalMujer.value = 0
      totalHombre.value = 0
      return
    }
    if (currentFilter?.key === 'porId') {
      const trimmed = busqueda.value.trim()
      if (!trimmed) {
        productos.value = []
        total.value = 0
        totalOfertas.value = 0
        totalMujer.value = 0
        totalHombre.value = 0
        return
      }
      const id = Number(trimmed)
      if (Number.isNaN(id)) {
        productos.value = []
        total.value = 0
        totalOfertas.value = 0
        totalMujer.value = 0
        totalHombre.value = 0
        return
      }
      const response = await productosApiGetProducto(id)
      const producto = (response as any)?.data || null
      const items = producto ? [producto] : []
      productos.value = items
      total.value = items.length
      totalOfertas.value = items.filter((p: any) => p.en_oferta).length
      totalMujer.value = items.filter((p: any) => p.para_mujer).length
      totalHombre.value = items.filter((p: any) => !p.para_mujer).length
      offset.value = 0
      return
    }
    let endpoint = ''
    if (busqueda.value) {
      endpoint = `${currentFilter.endpoint}?busqueda=${encodeURIComponent(busqueda.value)}&limit=${PAGE_SIZE}&offset=${offset.value}`
    } else {
      endpoint = `${currentFilter.endpoint}?limit=${PAGE_SIZE}&offset=${offset.value}`
    }
    const data = await fetchProductos(endpoint)
    const items = data.items || []
    productos.value = items
    total.value = data.count || 0
    totalOfertas.value = items.filter((p: any) => p.en_oferta).length
    totalMujer.value = items.filter((p: any) => p.para_mujer).length
    totalHombre.value = items.filter((p: any) => !p.para_mujer).length
  } catch (e) {
    error.value = true
  } finally {
    isLoading.value = false
  }
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
function onTableSearch(query: string) {
  busqueda.value = query
}
onMounted(fetchData)
</script>

<style scoped>
.grid.grid-cols-2 {
  gap: 1.5rem;
}
.sm\:grid-cols-4 {
  gap: 2rem;
}
.flex.flex-col.gap-3.sm\:flex-row {
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.relative.max-w-xs.flex-1 input {
  font-size: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border, #eee);
  padding: 0.75rem 1rem 0.75rem 2.5rem;
}
.rounded-2xl.border.bg-destructive\/5 {
  margin-top: 2rem;
}
/* Copiado de HomeView.vue para filtros y buscador */
.catalog-content {
  background: var(--card-bg, #fff8fa);
  border-radius: 1rem;
  border: 1px solid var(--border, #eee);
  padding: 0.5rem 0.25rem;
  text-align: center;
  margin-left: 0;
  margin-right: 0;
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
