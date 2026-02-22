<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 p-4"
    @click="onClose"
    role="dialog"
    aria-modal="true"
    aria-label="Contactos WhatsApp"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-border bg-white p-0 shadow-2xl overflow-hidden"
      @click.stop
    >
      <div class="flex items-center justify-between bg-primary px-6 py-4">
        <h3 class="font-display text-xl text-white">Contactos WhatsApp</h3>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground bg-white/20 hover:bg-white/40 transition"
          type="button"
          @click="onClose"
          aria-label="Cerrar"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
      <div
        v-if="producto && producto.id && producto.nombre && producto.precio"
        class="mx-6 mt-4 rounded-xl border border-primary bg-pink-50 p-4"
      >
        <p class="text-xs uppercase tracking-widest text-primary font-semibold">
          Consultando sobre
        </p>
        <p class="mt-1 font-medium text-foreground">{{ producto.nombre }}</p>
        <div class="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span class="font-semibold text-primary">ID: #{{ producto.id }}</span>
          <span class="h-1 w-1 rounded-full bg-primary/40" />
          <span class="font-semibold text-primary">${{ producto.precio }}</span>
        </div>
      </div>
      <div class="mt-4 flex flex-col gap-2 px-6 pb-6">
        <a
          v-for="contacto in contactos"
          :key="contacto.wa"
          class="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:border-primary hover:bg-primary/10 group"
          :href="buildWhatsappLink(contacto.wa, producto)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            <p class="font-medium text-foreground group-hover:text-primary">
              {{ contacto.nombre }}
            </p>
            <p class="text-sm text-muted-foreground group-hover:text-primary/80">
              {{ contacto.numero }}
            </p>
          </div>
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-white shadow-md group-hover:scale-110 transition"
          >
            <MessageCircle class="h-4 w-4" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageCircle, X } from 'lucide-vue-next'
import { buildWhatsappLink, WHATSAPP_CONTACTOS as contactos } from '../api'
const props = defineProps({
  isOpen: Boolean,
  onClose: Function,
  producto: Object,
})
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
