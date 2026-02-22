<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-secondary px-4 text-center">
    <div class="w-full max-w-sm">
      <div class="mb-8 flex flex-col items-center gap-3 text-center">
        <div
          class="logo-float flex h-20 w-20 items-center justify-center rounded-full bg-accent shadow-md overflow-hidden"
        >
          <img src="/bbtito_logo.png" alt="BBTito Logo" class="h-full w-full object-contain" />
        </div>
        <h1 class="font-display text-3xl font-bold tracking-wide text-foreground text-center">
          BBTito Admin
        </h1>
        <p class="text-sm text-muted-foreground text-center">
          Ingresa tus credenciales para continuar
        </p>
      </div>
      <form
        @submit.prevent="handleSubmit"
        class="rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-2">
            <label for="nombre" class="text-sm font-medium text-foreground">Usuario</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre de usuario"
              v-model="nombre"
              required
              autofocus
              autocomplete="username"
              class="h-11 rounded-xl bg-secondary/50 px-3"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-foreground">Contraseña</label>
            <div class="relative flex items-center">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Tu contraseña"
                v-model="contraseña"
                required
                autocomplete="current-password"
                class="h-11 w-full rounded-xl bg-secondary/50 pr-12 pl-3 text-base"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-lg text-muted-foreground transition hover:text-foreground"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>
          <div v-if="error" class="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {{ error }}
          </div>
          <button
            type="submit"
            :disabled="loading || !nombre || !contraseña"
            class="h-11 rounded-xl text-sm font-semibold uppercase tracking-wider bg-primary text-primary-foreground transition disabled:opacity-60"
          >
            <span v-if="loading">Ingresando...</span>
            <span v-else>Iniciar sesión</span>
          </button>
        </div>
      </form>
      <p class="mt-6 text-center text-xs text-muted-foreground">
        <a href="/" class="transition hover:text-primary">Volver a la tienda</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import IconBbtito from '../components/icons/IconBbtito.vue'

const router = useRouter()
const nombre = ref('')
const contraseña = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

import { loginUser } from '../lib/api-auth'

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await loginUser(nombre.value, contraseña.value)
    loading.value = false
    router.push({ path: '/admin' })
  } catch (err: any) {
    error.value = err && err.message ? err.message : 'Error al iniciar sesión'
    loading.value = false
  }
}
</script>

<style scoped>
.logo-float {
  animation: logoFloat 4s ease-in-out infinite;
}
@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
.min-h-screen.w-full.flex.items-center.justify-center.bg-secondary.px-4.text-center {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.w-full.max-w-sm {
  background: var(--card-bg, #fff8fa);
  border-radius: 1.5rem;
  border: 1px solid var(--border, #eee);
  box-shadow: 0 2px 16px 0 #ff2d9522;
  padding: 2rem 1.5rem;
  margin: 0 auto;
}
form.rounded-2xl {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}
input[type='text'],
input[type='password'] {
  font-size: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border, #eee);
  padding: 0.75rem 1rem;
  background: var(--secondary, #f6f6f6);
}
button[type='submit'] {
  margin-top: 0.5rem;
}
</style>
