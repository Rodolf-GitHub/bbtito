<template>
  <section class="mx-auto max-w-6xl pb-20 px-6">
    <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 text-[11px] uppercase tracking-widest text-primary">
          <MessageCircle class="h-3.5 w-3.5" />
          <span>Contacto</span>
        </div>
        <h2 class="font-display text-2xl text-foreground sm:text-3xl text-balance">
          Escríbenos para separar tu prenda
        </h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Nuestro catálogo va variando y lo actualizamos cada semana. Escríbenos para mantenerte al
          tanto y enviarte el detalle de la prenda que te interesa.
        </p>
      </div>
      <div class="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p
            class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <MessageCircle class="h-3.5 w-3.5" /> WhatsApp
          </p>
          <div class="mt-3 flex flex-col gap-2">
            <a
              v-for="contacto in contactos"
              class="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:border-primary hover:bg-accent/30"
              :href="buildWhatsappLink(contacto.wa)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <p class="font-medium text-foreground">{{ contacto.nombre }}</p>
                <p class="text-sm text-muted-foreground">{{ contacto.numero }}</p>
              </div>
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-primary-foreground"
              >
                <IconWhatsapp class="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
        <div class="flex flex-wrap gap-6 border-t border-border pt-4">
          <div class="flex items-start gap-2">
            <Clock class="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">Horario</p>
              <p class="text-sm text-foreground">Lun - Sab, 9:00 a 19:00</p>
            </div>
          </div>
          <div class="flex items-start gap-2">
            <MapPin class="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">Ubicación</p>
              <p class="text-sm text-foreground">Montevideo, Uruguay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Clock, MapPin } from 'lucide-vue-next'
import IconWhatsapp from './icons/IconWhatsapp.vue'
import { buildWhatsappLink, WHATSAPP_CONTACTOS as contactos } from '../api'
</script>

<!-- Tailwind CSS classes, no scoped styles needed -->
