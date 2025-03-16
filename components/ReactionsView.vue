<script lang="ts" setup>
interface Props {
  targetId: string
}

const props = defineProps<Props>()
defineEmits(['react'])
defineExpose({
  open,
})
const { targetId } = toRefs(props)
const uploadsStore = useUploadsStore()
const { uploads } = storeToRefs(uploadsStore)

const reactions = reactive({
  visible: false,
  reactions: [] as any[],
})

function open() {
  reactions.visible = true
}

const { execute, data: reactionsData } = useApi<any[]>(`/api/uploads/${targetId.value}/reaction`, {
  immediate: false,
  method: 'GET',

})

const upload = computed(() => uploads.value.find(upload => upload.id === targetId.value))

watch(reactionsData, (data) => {
  reactions.reactions = data ?? []
}, { deep: true })

await execute()
</script>

<template>
  <v-bottom-sheet
    v-if="upload"
    v-model="reactions.visible"
  >
    <template #activator>
      <v-btn
        size="small"
        flat
        rounded
        variant="text"
        :prepend-icon="upload.reacted ? 'mdi-heart' : 'mdi-heart-outline'"
        :text="$t('action.like')"
        @click="$emit('react')"
      />
    </template>
    <template #default>
      <div class="flex justify-end p-3">
        <v-btn
          color="error"
          flat
          variant="flat"
          size="x-small"
          icon="mdi-close"
          @click="reactions.visible = false"
        />
      </div>
      <v-card class="flex flex-col pt-1 rounded-t-xl!">
        <div class="flex flex-col">
          <div
            v-for="reaction in reactions.reactions"
            :key="reaction.id"
            class="flex items-center justify-between p-3"
          >
            <div class="flex items-center">
              <Icon
                name="mdi:heart"
                class="text-red"
              />
              <span class="ml-3">{{ reaction.userName }}</span>
            </div>
          </div>
        </div>
      </v-card>
    </template>
  </v-bottom-sheet>
</template>

<style>

</style>
