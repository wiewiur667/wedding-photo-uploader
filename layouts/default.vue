<script setup lang="ts">
const appStore = useAppStore()
const { userName } = storeToRefs(appStore)
</script>

<template>
  <v-app>
    <v-main class="max-h-vh min-h-0 flex flex-col overflow-auto bg-gray-100 p-0!">
      <slot />
    </v-main>
  </v-app>
</template>
