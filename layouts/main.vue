<script setup lang="ts">
const userStore = useUserStore()
const { userName, isAdmin } = storeToRefs(userStore)

const userInitials = computed(() => {
  const initials = userName.value.split(' ').map((n: string) => n[0])
  return `${initials.join('')}`
})
</script>

<template>
  <v-app class="background__container bg-slate-100!">
    <v-app-bar
      class="app-bar__background__container px-3"
      flat
      scroll-behavior="hide"
    >
      <template #prepend>
        <v-app-bar-nav-icon />
      </template>
      <v-app-bar-title>K i S</v-app-bar-title>

      <template #append>
        <Icon
          v-if="isAdmin"
          name="mdi:crown"
          class="text-yellow-500"
          title="Admin"
        />
        <v-chip class="ml-2">
          {{ userInitials }}
        </v-chip>
      </template>
    </v-app-bar>
    <v-main class="flex flex-col">
      <slot />
    </v-main>
    <w-upload />
  </v-app>
</template>

<style lang="scss">
.background__container::before {
  display: block;
  content: ' ';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('~/public/assets/couple-bg.jpg');
  background-size: cover;
  background-position: top;
  filter: blur(30px);
  transform: scale(1.2);
  z-index: 0;
}

.app-bar__background__container::before {
  display: block;
  content: ' ';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('~/public/assets/couple-bg.jpg');
  background-size: cover;
  background-position: top;
  filter: blur(30px);
  z-index: 0;
}
</style>
