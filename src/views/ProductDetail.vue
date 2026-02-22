<template>
  <div class="detail-page">
    <template v-if="!loading && producto">
      <main class="detail-card">
        <div class="image-wrap">
          <img v-if="imgSrc" :src="imgSrc" :alt="producto.nombre" />
          <div v-else class="placeholder">Sin imagen</div>
          <span v-if="producto.en_oferta" class="pill">En oferta</span>
        </div>
        <div class="info">
          <p class="eyebrow">#{{ producto.id }} · {{ producto.para_mujer ? 'Mujer' : 'Hombre' }}</p>
          <h1>{{ producto.nombre }}</h1>
          <p class="price">${{ displayPrice }}</p>
          <p class="description">
            Comparte este link o contáctanos por WhatsApp para resolver tus dudas.
          </p>
          <div class="actions">
            <button class="primary" @click="shareProducto">Compartir</button>
            <button class="secondary" @click="abrirWhatsapp">
              <svg aria-hidden="true" class="whatsapp-icon" viewBox="0 0 32 32" focusable="false">
                <path
                  fill="currentColor"
                  d="M16.04 4C9.86 4 4.86 8.99 4.86 15.17c0 2.63.86 5.07 2.34 7.05L6 28l5.96-1.95c1.86 1.02 4 1.6 6.3 1.6 6.18 0 11.17-4.99 11.17-11.17C29.43 8.99 24.24 4 18.06 4h-2.02zm6.1 16.12c-.26.73-1.53 1.39-2.1 1.43-.56.05-1.18.05-1.9-.12-.44-.1-1-.33-1.72-.64-3.03-1.32-5-4.41-5.15-4.62-.15-.2-1.23-1.64-1.23-3.13 0-1.48.78-2.22 1.06-2.53.28-.3.62-.38.83-.38.2 0 .4 0 .57.01.18.01.43-.07.68.52.26.64.87 2.2.95 2.36.08.15.13.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.37-.46.5-.15.15-.3.31-.13.6.18.3.78 1.28 1.67 2.08 1.15 1.02 2.12 1.34 2.44 1.49.32.15.5.13.68-.07.18-.2.78-.9.98-1.21.2-.3.4-.25.68-.15.28.1 1.77.84 2.07.99.3.15.5.23.57.35.07.12.07.72-.18 1.45z"
                />
              </svg>
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </main>

      <div class="footer-actions">
        <button class="back-large" type="button" @click="volverCatalogo">
          ← Volver al catálogo
        </button>
      </div>
    </template>

    <div v-else-if="loading" class="state">Cargando producto...</div>
    <div v-else class="state error">No encontramos este producto.</div>

    <WhatsappSelector
      :isOpen="whatsappOpen"
      :producto="productoConsulta"
      :onClose="closeWhatsapp"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productosApiGetProducto } from '../api/generated'
import { buildImageUrl } from '../api'
import WhatsappSelector from '../components/WhatsappSelector.vue'
import type { ProductoSchema } from '../api/schemas'

const route = useRoute()
const router = useRouter()
const producto = ref<ProductoSchema | null>(null)
const loading = ref(true)
const detailUrl = computed(() => `${window.location.origin}/producto/${route.params.id}`)
const whatsappOpen = ref(false)
const productoConsulta = ref<ProductoSchema | null>(null)

const imgSrc = computed(() =>
  producto.value?.imagen ? buildImageUrl((producto.value as any).imagen) : '',
)
const displayPrice = computed(() => {
  const raw = Number((producto.value as any)?.precio ?? 0)
  if (Number.isNaN(raw)) return 0
  return Math.floor(raw)
})

async function cargarProducto() {
  const id = Number(route.params.id)
  if (Number.isNaN(id)) {
    router.push('/')
    return
  }
  try {
    const res = await productosApiGetProducto(id)
    producto.value = (res as any)?.data || null
  } catch (e) {
    producto.value = null
  } finally {
    loading.value = false
  }
}

function copyFallback(url: string) {
  const input = document.createElement('input')
  input.value = url
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  alert('Enlace copiado')
}

async function shareProducto() {
  const url = detailUrl.value
  const title = producto.value?.nombre || 'Producto BBTito'
  const text = 'Mira este producto en BBTito'
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url })
      return
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      alert('Enlace copiado')
      return
    }
    copyFallback(url)
  } catch (e) {
    copyFallback(url)
  }
}

function abrirWhatsapp() {
  if (producto.value) {
    productoConsulta.value = producto.value
  }
  whatsappOpen.value = true
}

function volverCatalogo() {
  router.push({ path: '/', hash: '#catalogo' })
}

function closeWhatsapp() {
  whatsappOpen.value = false
  productoConsulta.value = null
}

onMounted(cargarProducto)
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: var(--background, #fff8fa);
  color: var(--foreground, #1b1b1f);
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.detail-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.share-chunk {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.kicker {
  font-size: 0.85rem;
  color: var(--muted-foreground, #7a7a7a);
}
.share-btn,
.primary,
.secondary {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease;
}
.share-btn,
.primary {
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  color: #fff;
  box-shadow: 0 10px 24px rgba(255, 45, 149, 0.25);
}
.secondary {
  background: linear-gradient(135deg, #25d366, #1ebe57);
  color: #fff;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 10px 24px rgba(37, 211, 102, 0.25);
}
.share-btn:hover,
.primary:hover,
.secondary:hover {
  transform: translateY(-2px);
}
.secondary .whatsapp-icon {
  width: 18px;
  height: 18px;
}
.detail-card {
  background: #fff;
  border-radius: 24px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  border: 1px solid var(--border, #eee);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.04);
}
.image-wrap {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #f6f7fb;
  min-height: 320px;
}
.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted-foreground, #7a7a7a);
}
.pill {
  position: absolute;
  left: 12px;
  top: 12px;
  background: var(--primary, #ff2d95);
  color: #fff;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}
.info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.eyebrow {
  font-size: 0.9rem;
  color: var(--muted-foreground, #7a7a7a);
}
.info h1 {
  font-size: 1.7rem;
  line-height: 1.2;
  color: var(--foreground, #1b1b1f);
}
.price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary, #ff2d95);
}
.description {
  color: var(--muted-foreground, #7a7a7a);
  line-height: 1.5;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}
.state {
  text-align: center;
  color: var(--muted-foreground, #7a7a7a);
  margin-top: 3rem;
}
.state.error {
  color: #d14343;
}
.footer-actions {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}
.back-large {
  color: #fff;
  font-weight: 800;
  text-decoration: none;
  background: linear-gradient(120deg, var(--primary, #ff2d95), #ff6fb1);
  border: none;
  border-radius: 999px;
  padding: 1rem 2rem;
  box-shadow: 0 16px 34px rgba(255, 45, 149, 0.28);
  cursor: pointer;
  width: min(420px, 100%);
  text-align: center;
}
.back-small {
  color: var(--primary, #ff2d95);
  font-weight: 700;
  text-decoration: none;
  background: #fff;
  border: 1px solid var(--primary, #ff2d95);
  border-radius: 999px;
  padding: 0.65rem 1.4rem;
  cursor: pointer;
  width: min(260px, 100%);
  text-align: center;
}
@media (max-width: 640px) {
  .detail-hero {
    flex-direction: column;
    align-items: flex-start;
  }
  .share-chunk {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
