<script lang="ts" setup>
import { DateTime } from 'luxon'
import { defaultDateFormat } from '~/code/utils'

interface Props {
  uploads: any[]
  index: number
}

const { uploads, index } = defineProps<Props>()

defineEmits(['close', 'next', 'prev'])

const target = computed(() => uploads.at(index))

const { data: commentsData, refresh, status } = useAsyncData('comments', () => $fetch(`/api/photo/${target.value.id}/comment`, {
  params: {
    id: target.value.id,
  },
}))

const commentText = ref('')

const commentsVisible = ref(true)

async function saveComment() {
  await useApi(`/api/photo/${target.value.id}/comment`, {
    body: JSON.stringify({
      comment: commentText.value,
    }),
  })
  commentText.value = ''
  refresh()
}

async function loadMoreComments() {

}

</script>

<template>
  <v-card
    v-touch="{
      up: () => commentsVisible = true,
      next: () => $emit('next'),
      prev: () => $emit('prev'),
    }"
    class="relative flex flex-col touch-manipulation items-center justify-center bg-black"
  >
    <div class="absolute bottom-0 left-0 right-0 top-0 flex flex-col p-3">
      <div class="flex items-center justify-between gap-3">
        <span class="truncate">{{ target.name }}</span>
        <v-btn
          variant="tonal"
          size="small"
          text="Zamknij"
          @click="() => $emit('close')"
        />
      </div>
      <v-spacer />
      <div
        v-if="commentsData?.rows?.at(0)"
        class="flex items-center justify-center gap-3 text-xs font-thin text-slate-300!"
      >
        <span class="overflow-clip">{{ commentsData.rows?.at(0)!.comment }}</span>
        <v-spacer />
        <div
          v-show="status === 'success'"
          class="flex flex-col items-end"
        >
          <span>{{ DateTime.fromMillis(commentsData.rows?.at(0)!.created_at).toFormat(defaultDateFormat) }}</span>
          <span>{{ commentsData.rows?.at(0)!.user_name }}</span>
        </div>
        <v-chip @click="commentsVisible = true">
          <Icon name="mdi:comment" />
        </v-chip>
      </div>
    </div>
    <img
      :src="`/api/photo/${target.id}`"
      class="object-cover object-center w-full!"
      :alt="target.name"
    >
  </v-card>
  <v-bottom-sheet v-model="commentsVisible">
    <div class="bg-white py-1 flex flex-col gap-3">
        <v-data-iterator
          v-if="status === 'success'"
          :items="commentsData?.rows ?? []"
        >
          <template #default="{ items: comments }">
            <div
              v-for="comment in comments"
              :key="comment.raw.id"
              class="flex items-center justify-center gap-3 text-xs font-thin text-slate-900! border-b p-1 px-3"
            >
              <span class="overflow-clip flex-1">{{ comment.raw!.comment }}</span>
              <div
                v-show="status === 'success'"
                class="flex flex-col items-end"
              >
                <span>{{ DateTime.fromMillis(comment.raw!.created_at).toFormat(defaultDateFormat) }}</span>
                <span>{{ comment.raw!.user_name }}</span>
              </div>
            </div>
          </template>
        </v-data-iterator>
      <div class="flex items-center gap-3 p-1 px-3">
        <v-text-field
          v-model="commentText"
          density="compact"
          placeholder="Komentarz"
          variant="solo-filled"
          hide-details
          flat
        />
        <v-btn @click="() => saveComment()" variant="flat" color="primary">
          Wyslij
        </v-btn>
      </div>
    </div>
  </v-bottom-sheet>
</template>

<!-- <style>
.test {
  background-image: url(`/api/photo/${props.target.id}`);
}
</style> -->
