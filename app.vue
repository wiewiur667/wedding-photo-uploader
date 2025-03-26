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

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
