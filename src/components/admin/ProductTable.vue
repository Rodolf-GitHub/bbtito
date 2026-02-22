<template>
  <div class="overflow-x-auto rounded-2xl border border-border bg-card p-4 mt-4">
    <!-- Buscador movido a AdminDashboard.vue -->
    <div class="flex justify-end mb-2 md:hidden">
      <button
        @click="expanded = !expanded"
        class="rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold shadow hover:bg-primary/90 transition"
      >
        {{ expanded ? 'Colapsar' : 'Expandir' }}
      </button>
    </div>
    <table class="min-w-full text-left text-sm">
      <thead>
        <tr>
          <th v-if="expanded || isDesktop" class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Imagen</th>
          <th class="px-4 py-2">Nombre</th>
          <th class="px-4 py-2">Precio</th>
          <th v-if="expanded || isDesktop" class="px-4 py-2">Oferta</th>
          <th v-if="expanded || isDesktop" class="px-4 py-2">Género</th>
          <th class="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in productos" :key="p.id" class="border-t border-border hover:bg-secondary/40">
          <td v-if="expanded || isDesktop" class="px-4 py-2 font-mono">{{ p.id }}</td>
          <td class="px-4 py-2">
            <img
              v-if="p.imagen"
              :src="buildImageUrl(p.imagen)"
              alt="img"
              class="w-12 h-12 object-cover rounded border cursor-zoom-in"
              @click="$emit('imageClick', buildImageUrl(p.imagen), p.nombre || 'Producto')"
            />
            <span v-else class="text-muted-foreground text-xs">Sin imagen</span>
          </td>
          <td class="px-4 py-2">{{ p.nombre }}</td>
          <td class="px-4 py-2">${{ p.precio }}</td>
          <td v-if="expanded || isDesktop" class="px-4 py-2">
            <span
              v-if="p.en_oferta"
              class="rounded-full bg-primary text-primary-foreground px-2 py-1 text-xs font-bold"
              >Sí</span
            >
            <span v-else class="text-muted-foreground text-xs">No</span>
          </td>
          <td v-if="expanded || isDesktop" class="px-4 py-2">
            <span
              v-if="p.para_mujer"
              class="rounded-full bg-pink-100 text-pink-700 px-2 py-1 text-xs font-bold"
              >Mujer</span
            >
            <span v-else class="rounded-full bg-blue-100 text-blue-700 px-2 py-1 text-xs font-bold"
              >Hombre</span
            >
          </td>
          <td class="px-4 py-2 flex gap-2">
            <button
              @click="$emit('edit', p)"
              class="icon-btn bg-primary/90 hover:bg-primary"
              title="Editar"
            >
              <Pencil :size="18" />
            </button>
            <button
              @click="$emit('delete', p)"
              class="icon-btn bg-destructive/90 hover:bg-destructive"
              title="Eliminar"
            >
              <Trash2 :size="18" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!productos || productos.length === 0" class="text-center text-muted-foreground py-8">
      No hay productos para mostrar.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { buildImageUrl } from '../../api'
const { productos } = defineProps<{ productos: any[] }>()
const emit = defineEmits(['edit', 'delete', 'imageClick'])

const expanded = ref(false)
const isDesktop = ref(false)

function checkDesktop() {
  isDesktop.value = window.innerWidth >= 1024
  if (isDesktop.value) expanded.value = true
  else expanded.value = false
}
onMounted(() => {
  checkDesktop()
  window.addEventListener('resize', checkDesktop)
})
onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop)
})
</script>
<style scoped>
/* Buscador movido a AdminDashboard.vue */
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  color: var(--primary-foreground);
  transition: background 0.15s;
}
.icon-btn.bg-primary\/90 {
  background: var(--primary, #6366f1);
}
.icon-btn.bg-destructive\/90 {
  background: var(--destructive, #ef4444);
}
.icon-btn:hover {
  filter: brightness(0.95);
}
</style>
