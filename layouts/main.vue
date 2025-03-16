<script setup lang="ts">
const userStore = useUserStore()
const { userName, isAdmin } = storeToRefs(userStore)

const userInitials = computed(() => {
  const initials = userName.value.split(' ').map((n: string) => n[0])
  return `${initials.join('')}`
})
</script>

<template>
  <v-app>
    <v-app-bar
      flat
      class="px-3 text-white"
      color="transparent"
      density="compact"
    >
      <v-app-bar-title>K i S</v-app-bar-title>
      <v-spacer />
      <Icon 
        name="mdi:crown" 
        v-if="isAdmin" 
        class="text-yellow-500"
        title="Admin"
      />
      <v-chip class="ml-2">
        {{ userInitials }}
      </v-chip>
    </v-app-bar>
    <v-main class="flex flex-col bg-slate-900">
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
