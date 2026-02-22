<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex flex-col justify-center items-center min-h-screen bg-black/60 px-2 py-8 sm:px-0 sm:py-0"
  >
    <div
      class="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 w-full max-w-xl max-h-[92vh] overflow-y-auto relative border border-border/60"
    >
      <div
        class="absolute inset-x-6 top-0 h-1.5 rounded-b-full bg-gradient-to-r from-primary via-pink-400 to-orange-300"
      />
      <button
        class="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 shadow-sm transition"
        @click="$emit('close')"
        type="button"
        aria-label="Cerrar"
      >
        ✕
      </button>
      <div class="mb-6 flex flex-col gap-1 text-center">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary/90">
          Gestión de catálogo
        </p>
        <h2 class="text-2xl font-bold text-foreground">
          {{ isEdit ? 'Editar producto' : 'Crear producto' }}
        </h2>
        <p class="text-sm text-muted-foreground">Completa la información y guarda los cambios.</p>
      </div>
      <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Nombre del producto</label>
            <input
              v-model="form.nombre"
              required
              class="input h-11 rounded-xl"
              placeholder="Ej: Camiseta Nike Dri-FIT"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium">Precio</label>
            <input
              v-model.number="form.precio"
              type="number"
              min="0"
              required
              class="input h-11 rounded-xl"
              placeholder="Ej: 1500"
            />
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="pill"
            :class="{ active: form.para_mujer }"
            @click="form.para_mujer = true"
          >
            Para mujer
          </button>
          <button
            type="button"
            class="pill"
            :class="{ active: !form.para_mujer }"
            @click="form.para_mujer = false"
          >
            Para hombre
          </button>
          <button
            type="button"
            class="pill"
            :class="{ active: form.en_oferta }"
            @click="form.en_oferta = !form.en_oferta"
          >
            {{ form.en_oferta ? 'En oferta' : 'Sin oferta' }}
          </button>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Imagen</label>
          <div v-if="imagenPreview" class="relative w-fit">
            <img
              :src="imagenPreview"
              alt="Preview"
              class="h-48 w-48 rounded-xl border object-cover"
            />
            <button
              type="button"
              @click="removeImage"
              class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm"
            >
              ✕
            </button>
          </div>
          <button
            v-else
            type="button"
            @click="triggerFile"
            class="flex h-48 w-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/30 text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <span class="text-3xl">📷</span>
            <span class="text-xs">Subir imagen</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="onFileChange"
            class="hidden"
          />
        </div>
        <div class="flex gap-3 mt-4 flex-wrap">
          <button
            type="submit"
            class="bg-primary text-primary-foreground rounded-xl px-8 h-11 font-semibold shadow-sm hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
            :disabled="!form.nombre || !form.precio || saving"
          >
            <span v-if="saving" class="inline-flex items-center gap-2">
              <span class="spinner" aria-hidden="true"></span>
              {{ isEdit ? 'Guardando...' : 'Creando...' }}
            </span>
            <span v-else>
              {{ isEdit ? 'Guardar' : 'Crear' }}
            </span>
          </button>
          <button
            type="button"
            class="bg-muted text-muted-foreground rounded-xl px-8 h-11 font-semibold hover:bg-muted/80 transition"
            @click="$emit('close')"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { buildImageUrl } from '../../api'
const props = defineProps<{
  open: boolean
  isEdit?: boolean
  producto?: any
}>()
const emit = defineEmits(['close', 'save'])
const saving = ref(false)
const form = reactive({
  nombre: '',
  precio: 0,
  imagen: '',
  en_oferta: false,
  para_mujer: true,
})
const imagenPreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
function triggerFile() {
  fileInput.value?.click()
}
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      imagenPreview.value = reader.result as string
      form.imagen = '' // Limpiar campo texto si sube archivo
    }
    reader.readAsDataURL(file)
  }
}
function removeImage() {
  imagenPreview.value = null
  if (fileInput.value) fileInput.value.value = ''
}
watch(
  () => props.producto,
  (val) => {
    if (val) {
      Object.assign(form, val)
      imagenPreview.value = val.imagen ? buildImageUrl(val.imagen) : null
    } else {
      form.nombre = ''
      form.precio = 0
      form.imagen = ''
      form.en_oferta = false
      form.para_mujer = true
      imagenPreview.value = null
    }
  },
  { immediate: true },
)
async function onSubmit() {
  if (saving.value) return
  saving.value = true
  await emit('save', { ...form, imagen: imagenPreview.value || form.imagen })
  saving.value = false
}
</script>

<style scoped>
.pill {
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.55rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  background: var(--card);
  color: var(--foreground);
  transition: all 0.2s ease;
}
.pill.active {
  border-color: transparent;
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  color: #fff;
  box-shadow: 0 8px 20px rgba(255, 45, 149, 0.18);
}
.input {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: var(--card);
}
.spinner {
  width: 1rem;
  height: 1rem;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
