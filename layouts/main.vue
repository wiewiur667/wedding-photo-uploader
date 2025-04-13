<script setup lang="ts">
import { WUpload } from '#components'

const userStore = useUserStore()
const { userName, isAdmin, userId } = storeToRefs(userStore)

const userInitials = computed(() => {
  const initials = userName.value?.split(' ').map((n: string) => n[0])
  return `${initials?.join('')}`
})

const uploadRef = ref<InstanceType<typeof WUpload> | null>(null)
provide('upload', {
  open: () => {
    uploadRef.value?.open()
  },
})
</script>

<template>
  <v-app full-height>
    <v-app-bar
      app
      class="text-gray-800!"
      scroll-behavior="hide"
      flat
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
        <v-chip class="ml-2 mr-1">
          {{ userInitials }}
        </v-chip>
      </template>
    </v-app-bar>

    <v-main class="flex justify-center mb-10!">
      <slot />
    </v-main>
    <div class="fixed bottom-0 left-0 right-0 flex items-center gap-3 bg-gray-800 p-3 py-1">
      <div
        class="flex flex-1 items-center justify-between gap-3 rounded-md bg-clip-padding px-3 backdrop-blur-sm backdrop-filter rounded-full! text-black!"
      >
        <v-btn
          variant="plain"
          :ripple="false"
          color="white"
          class="text-none"
          to="/"
          icon="mdi:home"
        />
        <v-btn
          variant="plain"
          :ripple="false"
          color="white"
          class="text-none"
          to="/menu"
          icon="mdi:book-open-page-variant"
        />
        <v-btn
          variant="plain"
          :ripple="false"
          color="white"
          class="text-none"
          icon="mdi:book-outline"
        />
        <v-btn
          variant="plain"
          :ripple="false"
          color="white"
          class="text-none"
          icon="mdi:image-multiple"
          to="/gallery"
        />
      </div>
      <WUpload ref="uploadRef" />
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
