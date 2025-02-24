<script setup lang="ts">
const appStore = useAppStore()
const { userName } = storeToRefs(appStore)
</script>

<template>
  <v-app>
    <v-main class="flex flex-col bg-gray-100">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss">
.background__container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../public/assets/background.png');
  background-size: cover;
  background-repeat: none;
  background-position: center center;
  filter: brightness(0.4);

  z-index: -1;
}
</style>
