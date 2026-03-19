<template>
  <footer class="w-full bg-card border-t border-border py-8 text-center text-muted-foreground">
    <div class="max-w-6xl mx-auto">
      <p>© {{ new Date().getFullYear() }} BBTito. Todos los derechos reservados.</p>
      <p class="mt-2 text-[11px]">
        <a
          href="https://groerosoftware.com"
          class="underline underline-offset-2"
          target="_blank"
          rel="noreferrer"
        >
          Powered by groerosoftware.com
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<!-- Tailwind CSS classes, no scoped styles needed -->
