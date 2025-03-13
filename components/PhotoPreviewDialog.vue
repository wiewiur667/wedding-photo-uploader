<script lang="ts" setup>
import { DateTime } from 'luxon'
import { defaultDateFormat } from '~/code/utils'

const { uploads, index } = defineProps<Props>()

defineEmits(['close', 'next', 'prev'])

const { mdAndUp } = useDisplay()

interface Props {
  uploads: any[]
  index: number
}

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
    <div class="absolute bottom-0 left-0 right-0 top-0 flex flex-col">
      <div class="flex items-center justify-between gap-3 p-3">
        <div class="flex flex-col">
          <span class="truncate">{{ target.name }}</span>
          <span class="text-xs">{{ target.timestamp.toFormat('dd/MM/yyyy hh:mm:ss') }} {{ target.byName }}</span>
        </div>
        <v-btn
          color="error"
          flat
          icon
          density="compact"
          variant="flat"
          @click="$emit('close')"
        >
          <Icon name="mdi:close" />
        </v-btn>
      </div>

      <v-spacer />
      <div
        v-if="commentsData?.at(0) && !commentsVisible"
        class="flex items-center justify-center gap-3 bg-white/10 p-3 text-xs font-thin text-slate-100!"
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
        <v-btn
          flat
          rounded
          color="primary"
          variant="flat"
          @click="commentsVisible = true"
        >
          <Icon name="mdi:comment" />
        </v-btn>
      </div>
    </div>
    <img
      :src="`/api/photo/${target.id}`"
      class="max-h-full object-cover object-center w-full!"
      :alt="target.name"
    >
  </v-card>
  <v-bottom-sheet
    v-model="commentsVisible"
    :inset="mdAndUp"
  >
    <div class="flex justify-end py-3">
      <v-btn
        color="error"
        flat
        icon
        density="compact"
        variant="flat"
        @click="commentsVisible = false"
      >
        <Icon name="mdi:close" />
      </v-btn>
    </div>
    <div class="flex flex-col bg-gray-700 pt-1 text-white!">
      <v-data-iterator
        v-if="status === 'success'"
        :items="commentsData ?? []"
      >
        <template #default="{ items: comments }">
          <template
            v-for="comment in comments"
            :key="comment.raw.id"
          >
            <div class="flex flex-col border-b px-2">
              <div
                class="flex items-center justify-center gap-3 py-1 text-xs font-thin text-white!"
              >
                <span class="overflow-clip">{{ comment.raw!.comment }}</span>
                <v-spacer />
                <div
                  v-show="status === 'success'"
                  class="flex flex-col items-end"
                >
                  <span>{{ DateTime.fromMillis(comment.raw!.created_at).toFormat('dd/MM/yyyy hh:mm:ss') }}</span>
                  <span>{{ comment.raw!.user_name }}</span>
                </div>
              </div>
            </div>
          </template>
        </template>
      </v-data-iterator>
      <v-form
        class="flex items-center gap-3 p-3"
        validate-on="input"
        @submit.prevent="saveComment"
      >
        <template #default="{ isValid }">
          <v-text-field
            v-model="commentText"
            class="flex-1"
            density="compact"
            placeholder="Komentarz"
            hide-details
            flat
            :rules="[
              (v) => !!v || 'Komentarz nie może być pusty',
            ]"
          />
          <v-btn
            type="submit"
            flat
            variant="tonal"
            :disabled="!isValid.value"
          >
            Wyslij
          </v-btn>
        </template>
      </v-form>
    </div>
  </v-bottom-sheet>
</template>

<!-- <style>
.test {
  background-image: url(`/api/photo/${props.target.id}`);
}
</style> -->
