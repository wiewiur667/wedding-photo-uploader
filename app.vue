<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
  @apply text-gray-700;
  @apply font-sans tracking-widest;
}

html.dark {
  background: #222;
  color: white;
}
</style>
