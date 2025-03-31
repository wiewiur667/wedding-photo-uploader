<script setup lang="ts">
const { mobile } = useDisplay()

const userStore = useUserStore()
const { userName, isAdmin } = storeToRefs(userStore)

const userInitials = computed(() => {
  const initials = userName.value?.split(' ').map((n: string) => n[0])
  return `${initials?.join('')}`
})
</script>

<template>
  <v-app full-height>
    <v-app-bar
      app
      class="app-bar__background__container px-3"
      flat
      scroll-behavior="hide"
    >
      <v-app-bar-title class="text-2xl font-thin!">
        Klaudia i Sebastian
      </v-app-bar-title>

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
    <div class="fixed bottom-0 left-0 right-0 flex items-center gap-3 p-3">
      <div
        class="flex flex-1 items-center justify-between gap-3 border rounded-md bg-clip-padding p-3 backdrop-blur-md backdrop-filter border-blue-100! rounded-full! bg-gray-500! bg-opacity-20!"
      >
        <v-btn
          variant="tonal"
          class="text-none"
          to="/"
          rounded
        >
          <div class="flex gap-2">
            <v-icon icon="mdi-home" />
            <span v-if="!mobile">Home</span>
          </div>
        </v-btn>
        <v-btn
          variant="tonal"
          class="text-none"
          to="/menu"
          rounded
        >
          <div class="flex gap-2">
            <v-icon icon="mdi-book-open-page-variant" />
            <span v-if="!mobile">Menu</span>
          </div>
        </v-btn>
        <v-btn
          variant="tonal"
          class="text-none"
          rounded
        >
          <div class="flex gap-2">
            <v-icon icon="mdi-book-outline" />
            <span v-if="!mobile">Plan</span>
          </div>
        </v-btn>
        <v-btn
          variant="tonal"
          class="text-none"
          rounded
          to="/gallery"
        >
          <div class="flex gap-2">
            <v-icon icon="mdi-camera" />
            <span v-if="!mobile">Galeria</span>
          </div>
        </v-btn>
      </div>
      <w-upload />
    </div>
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
