<script setup lang="ts">
const appStore = useAppStore()
const { userName, event } = storeToRefs(appStore)

const userInitials = computed(() => {
  const initials = userName.value.split(' ').map((n: string) => n[0])
  return `${initials.join('')}`
})


</script>

<template>
  <v-app>
    <v-app-bar
      flat
      class="px-3"
    >
      <v-app-bar-title>K i S</v-app-bar-title>
      <v-spacer />
      <v-chip>
        {{ userInitials }}
      </v-chip>
    </v-app-bar>
    <v-main class="flex flex-col bg-gray-100">
      <slot />

    </v-main>
    <w-upload />
    
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
