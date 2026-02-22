<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex flex-col justify-center items-center min-h-screen bg-black/60 px-2 py-8 sm:px-0 sm:py-0"
  >
    <div
      class="bg-white rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
    >
      <button
        class="absolute top-4 right-4 text-xl text-muted-foreground hover:text-foreground"
        @click="$emit('close')"
      >
        ✕
      </button>
      <h2 class="text-xl font-bold mb-4">{{ isEdit ? 'Editar producto' : 'Crear producto' }}</h2>
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
        <div class="flex flex-wrap gap-8">
          <div class="flex items-center gap-3">
            <input id="para_mujer" type="checkbox" v-model="form.para_mujer" />
            <label for="para_mujer" class="text-sm">{{
              form.para_mujer ? 'Para mujer' : 'Para hombre'
            }}</label>
          </div>
          <div class="flex items-center gap-3">
            <input id="en_oferta" type="checkbox" v-model="form.en_oferta" />
            <label for="en_oferta" class="text-sm">{{
              form.en_oferta ? 'En oferta' : 'Sin oferta'
            }}</label>
          </div>
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
        <div class="flex gap-3 mt-4">
          <button
            type="submit"
            class="bg-primary text-primary-foreground rounded-xl px-8 h-11 font-semibold"
            :disabled="!form.nombre || !form.precio"
          >
            {{ isEdit ? 'Guardar' : 'Crear' }}
          </button>
          <button
            type="button"
            class="bg-muted text-muted-foreground rounded-xl px-8 h-11 font-semibold"
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
const props = defineProps<{
  open: boolean
  isEdit?: boolean
  producto?: any
}>()
const emit = defineEmits(['close', 'save'])
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
      imagenPreview.value = val.imagen || null
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
function onSubmit() {
  emit('save', { ...form, imagen: imagenPreview.value || form.imagen })
}
</script>

<style scoped>
.input {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  background: var(--card);
}
</style>
