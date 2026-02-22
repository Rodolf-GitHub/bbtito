<template>
  <section class="mx-auto max-w-5xl pb-20 px-6">
    <div
      class="rounded-3xl border border-border bg-gradient-to-b from-card to-secondary/60 p-8 shadow-sm"
    >
      <div class="text-center max-w-3xl mx-auto mb-8 flex flex-col gap-3">
        <span
          class="inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full"
        >
          Contacto
        </span>
        <h2 class="font-display text-3xl text-foreground sm:text-4xl text-balance">
          Escríbenos para separar tu prenda
        </h2>
        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Nuestro catálogo cambia cada semana. Déjanos un mensaje y te mantenemos al tanto con el
          detalle de la prenda que te interesa.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div
            class="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"
          >
            <span class="h-2 w-2 rounded-full bg-primary"></span>
            WhatsApp
          </div>
          <div class="mt-2 flex flex-col gap-2">
            <a
              v-for="contacto in contactos"
              class="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition hover:border-primary hover:bg-accent/40"
              :href="buildWhatsappLink(contacto.wa)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div>
                <p class="font-medium text-foreground">{{ contacto.nombre }}</p>
                <p class="text-sm text-muted-foreground">{{ contacto.numero }}</p>
              </div>
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366] text-primary-foreground shadow"
              >
                <IconWhatsapp class="h-5 w-5" />
              </div>
            </a>
          </div>
        </div>
        <div class="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div class="flex items-start gap-3">
            <Clock class="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">Horario</p>
              <p class="text-sm text-foreground">Lun - Sab, 9:00 a 22:00</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <MapPin class="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p class="text-xs uppercase tracking-widest text-muted-foreground">Ubicación</p>
              <p class="text-sm text-foreground">Montevideo, Uruguay</p>
            </div>
          </div>
          <div
            class="rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-left text-sm text-muted-foreground"
          >
            Siempre respondemos en horario laboral. Déjanos tu mensaje y el producto que te
            interesa, y te compartimos fotos y detalles.
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
