<script lang="ts" setup>
interface Props {
  upload: {
    id: string
    type: string
    name: string
  }
  commentsAmount?: number
  likesAmount?: number
}
withDefaults(defineProps<Props>(), {
  commentsAmount: 0,
  likesAmount: 0,
})

defineEmits(['open'])
</script>

<template>
  <div
    class="square relative overflow-hidden"
    @click="$emit('open')"
  >
    <NuxtImg
      :src="`http://localhost:3000/api/photos/${upload.id}`"
      class="content h-full object-cover object-center"
      :alt="upload.name"
    >
      <div class="absolute bottom-0 left-0 right-0 flex flex-col justify-between p-2 px-4">
        <div class="flex justify-between">
          <v-chip
            color="primary"
            variant="flat"
          >
            <div class="flex items-center gap-2">
              <Icon name="mdi:comment" />
              <span>{{ commentsAmount }}</span>
            </div>
          </v-chip>
          <v-chip

            variant="flat"
            color="gray"
          >
            <div class="flex items-center gap-2">
              <Icon
                name="mdi:heart"
                color="red"
              />
              <span>{{ likesAmount }}</span>
            </div>
          </v-chip>
        </div>
      </div>
    </nuxtimg>
  </div>
</template>

<style lang="scss">
.square {
  position: relative;
  box-sizing: border-box;
  @apply rounded-sm
}

.square::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.square .content {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 100%;
}
</style>
