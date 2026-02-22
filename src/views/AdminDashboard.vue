<template>
  <div class="min-h-screen flex flex-col justify-center w-full bg-secondary">
    <div class="mx-auto w-full py-8 px-2 sm:px-6 lg:px-24 gap-6 flex flex-col">
      <div class="flex justify-start mb-2">
      <a href="/" class="inline-flex items-center gap-2 bg-muted text-foreground rounded-xl px-4 py-2 font-semibold hover:bg-muted/70 transition-colors">
        <span>←</span> Volver a la tienda
      </a>
    </div>
      <div class="flex flex-col gap-1">
      <h1 class="font-display text-2xl font-bold text-foreground">Productos</h1>
      <p class="text-sm text-muted-foreground">Gestiona tu catálogo de productos desde aquí.</p>
    </div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Total" :value="total" icon="📦" />
      <StatCard label="Ofertas" :value="totalOfertas" icon="🏷️" />
      <StatCard label="Mujer" :value="totalMujer" icon="F" />
      <StatCard label="Hombre" :value="totalHombre" icon="M" />
    </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative max-w-xs flex-1">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
        <input
          v-model="busqueda"
          placeholder="Buscar productos..."
          class="h-10 rounded-xl pl-9 border border-border w-full"
        />
      </div>
      <button @click="openCreateModal" class="h-10 rounded-xl gap-2 bg-primary text-primary-foreground flex items-center justify-center px-4 font-semibold">
        <span>➕</span> Nuevo producto
      </button>
    </div>
      <div v-if="isLoading" class="flex items-center justify-center py-16">
      <span class="animate-spin text-primary text-2xl">⏳</span>
    </div>
      <div v-else-if="error" class="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
      <p class="text-sm text-destructive">No se pudieron cargar los productos. Verifica que el servidor esté activo.</p>
      <button @click="fetchData" class="mt-4 rounded-xl border px-4 py-2">Reintentar</button>
    </div>
      <div v-else>
        <ProductTable :productos="productos" @edit="openEditModal" @delete="onDelete" />
        <div class="flex flex-col items-center gap-4 mt-6">
          <span class="text-sm font-medium text-primary bg-card rounded-full px-4 py-2 shadow-sm">
            Mostrando {{ productos.length }} elementos | Página {{ page }} de {{ totalPages }}
          </span>
          <div class="flex gap-3 mt-2">
            <button
              class="rounded-full px-5 py-2 text-sm font-semibold transition-colors shadow-sm"
              :class="{ 'bg-muted text-muted-foreground cursor-not-allowed': offset === 0, 'bg-primary text-primary-foreground hover:bg-primary/80': offset !== 0 }"
              :disabled="offset === 0"
              @click="prevPage"
            >Anterior</button>
            <button
              class="rounded-full px-5 py-2 text-sm font-semibold transition-colors shadow-sm"
              :class="{ 'bg-muted text-muted-foreground cursor-not-allowed': page >= totalPages, 'bg-primary text-primary-foreground hover:bg-primary/80': page < totalPages }"
              :disabled="page >= totalPages"
              @click="nextPage"
            >Siguiente</button>
          </div>
        </div>
        <ProductModal :open="modalOpen" :isEdit="!!selectedProduct" :producto="selectedProduct" @close="closeModal" @save="onSave" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchProductos, API_ENDPOINTS } from '../api'
import { productosApiCreateProducto } from '../api/generated'
import type { ProductosApiCreateProductoBody } from '../api/schemas'


import ProductTable from '../components/admin/ProductTable.vue'
import StatCard from '../components/admin/StatCard.vue'
import ProductModal from '../components/admin/ProductModal.vue'
// Modal state
const modalOpen = ref(false)
const selectedProduct = ref<any|null>(null)

function openCreateModal() {
  selectedProduct.value = null
  modalOpen.value = true
}
function openEditModal(product:any) {
  selectedProduct.value = { ...product }
  modalOpen.value = true
}
function closeModal() {
  modalOpen.value = false
  selectedProduct.value = null
}
async function onSave(product:any) {
  console.log('onSave ejecutado', product);
  isLoading.value = true;
  error.value = false;
  try {
    if (!selectedProduct.value) {
      // Adaptar exactamente al schema de orval
      let imagenBlob: Blob | undefined = undefined;
      if (product.imagen && typeof product.imagen === 'string' && product.imagen.startsWith('data:')) {
        // Convertir base64 a Blob
        const arr = product.imagen.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        imagenBlob = new Blob([u8arr], { type: mime });
      }
      const body: ProductosApiCreateProductoBody = {
        data: {
          nombre: product.nombre,
          precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
          para_mujer: product.para_mujer,
          en_oferta: product.en_oferta,
        },
        ...(imagenBlob ? { imagen: imagenBlob } : {})
      };
      console.log('Payload enviado a productosApiCreateProducto', body);
      await productosApiCreateProducto(body, {
        headers: { Authorization: `Bearer ${localStorage.getItem('bbtito_auth_token')}` }
      });
    } else {
      // Aquí iría la lógica de editar producto (no implementado)
    }
    closeModal();
    await fetchData();
  } catch (e) {
    error.value = true;
    console.error('Error al crear producto:', e);
  } finally {
    isLoading.value = false;
  }
}
function onDelete(product:any) {
  // Aquí deberías mostrar confirmación y llamar a la API para eliminar
  if (confirm('¿Seguro que deseas eliminar este producto?')) {
    // Llama a la API para eliminar y luego recarga
    fetchData()
  }
}


import { watch } from 'vue'
import type { ProductoSchema } from '../api/schemas'
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

let debounceTimeout: any = null
watch(busqueda, (val) => {
  offset.value = 0
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    fetchData()
  }, 400)
})

async function fetchData() {
  isLoading.value = true
  error.value = false
  try {
    let endpoint = ''
    if (busqueda.value) {
      endpoint = `${API_ENDPOINTS.listarTodos}?busqueda=${encodeURIComponent(busqueda.value)}&limit=${PAGE_SIZE}&offset=${offset.value}`
    } else {
      endpoint = `${API_ENDPOINTS.listarTodos}?limit=${PAGE_SIZE}&offset=${offset.value}`
    }
    const data = await fetchProductos(endpoint)
    productos.value = data.items
    total.value = data.count
    totalOfertas.value = data.items.filter((p:any) => p.en_oferta).length
    totalMujer.value = data.items.filter((p:any) => p.para_mujer).length
    totalHombre.value = data.items.filter((p:any) => !p.para_mujer).length
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
</style>
