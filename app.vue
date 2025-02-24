<script setup lang="ts">

</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
html {
  overflow-y: auto !important;
}
html,
body,
#__nuxt {
  @apply h-dvh m-0 p-0;
  @apply white;
  @apply tracking-widest;

  * {
    @apply min-w-0;
  }
}

html.dark {
  background: #222;
  color: white;
}
</style>
