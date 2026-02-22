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
      class="w-full max-w-md rounded-2xl border border-border bg-pink-100 p-6 shadow-lg"
      @click.stop
    >
      <div class="flex items-center justify-between">
        <h3 class="font-display text-xl text-foreground">Contactos WhatsApp</h3>
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          type="button"
          @click="onClose"
          aria-label="Cerrar"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
      <div v-if="producto" class="mt-3 rounded-xl border border-border bg-secondary/50 p-3">
        <p class="text-xs uppercase tracking-widest text-muted-foreground">Consultando sobre</p>
        <p class="mt-1 font-medium text-foreground">{{ producto.nombre }}</p>
        <div class="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span>ID: #{{ producto.id }}</span>
          <span class="h-1 w-1 rounded-full bg-muted-foreground" />
          <span class="font-semibold text-primary">${{ producto.precio }}</span>
        </div>
      </div>
      <div class="mt-4 flex flex-col gap-2">
        <a
          v-for="contacto in contactos"
          :key="contacto.wa"
          class="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:border-primary hover:bg-accent/30"
          :href="buildWhatsappLink(contacto.wa, producto)"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div>
            <p class="font-medium text-foreground">{{ contacto.nombre }}</p>
            <p class="text-sm text-muted-foreground">{{ contacto.numero }}</p>
          </div>
          <div
            class="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-primary-foreground"
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
