<script lang="ts" setup>
import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'
import { DateTime } from 'luxon'
import { VInfiniteScroll } from 'vuetify/components'

const { uploads, index } = defineProps<Props>()

defineEmits(['close', 'next', 'prev', 'like', 'dislike'])

const { mdAndUp } = useDisplay()

interface Props {
  uploads: any[]
  index: number
}

const target = computed(() => uploads.at(index))

const reactions = reactive({
  rows: [] as any[],
  total: 0,
  offset: 0,
  limit: 10,
})

async function loadReactions(offset: MaybeRef<number>, limit: MaybeRef<number>) {
  const result = await useApi<IPagedResult<any>>(`/api/photo/${target.value.id}/reaction`, {
    method: 'GET',
    query: {
      offset: toValue(offset),
      limit: toValue(limit),
    },
  })

  return {
    reactions: result?.rows,
    total: result?.total,
  }
}

await callOnce(async () => {
  const result = await loadReactions(reactions.offset, reactions.limit)
  reactions.rows = result?.reactions ?? []
  reactions.total = result?.total ?? 0
})

// const { comments: commentsData } = await loadComments(offset, limit)
// comments.value = commentsData ?? []

const commentText = ref('')

const commentsVisible = ref(true)

const comments = reactive({
  state: 'pending' as 'pending' | 'done',
  rows: [] as any[],
  total: 0,
  offset: 0,
  limit: 10,
})

async function loadComments(offset: MaybeRef<number>, limit: MaybeRef<number>) {
  const state = ref<'done' | 'pending'>('pending')
  const result = await useApi<IPagedResult<any>>(`/api/photo/${target.value.id}/comment`, {
    method: 'GET',
    query: {
      offset: toValue(offset),
      limit: toValue(limit),
    },
  })

  state.value = 'done'

  return {
    state,
    comments: result?.rows,
    total: result?.total,
  }
}

async function saveComment() {
  await useApi(`/api/photo/${target.value.id}/comment`, {
    body: JSON.stringify({
      comment: commentText.value,
    }),
  })
  commentText.value = ''
  const newComments = (await loadComments(comments.offset, comments.limit))
  comments.rows = [...comments.rows, ...newComments?.comments ?? []]
}

async function loadMoreComments({ done }: { side: any, done: (param: 'ok' | 'empty') => void }) {
  if ((comments.rows.length === 0 && comments.state === 'pending') || comments.rows.length < comments.total) {
    try {
      const newComments = await loadComments(comments.offset, comments.limit)
      comments.total = newComments?.total ?? 0
      comments.state = newComments?.state.value ?? 'done'
      comments.rows.push(...newComments?.comments ?? [])
      comments.offset = comments.rows.length

      if (comments.rows.length === 0) {
        done('empty')
        return
      }

      console.log('ok')
      done('ok')
      return
    }
    catch (error) {
      console.error(error)
      done('empty')
    }
  }
  console.log('empty')
  done('empty')
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
        v-if="!commentsVisible"
        class="flex items-center justify-center gap-3 bg-white/10 p-3 text-xs font-thin text-slate-100!"
      >
        <v-btn
          flat
          color="error"
          variant="flat"
          rounded
          @click="$emit('like')"
        >
          <div class="flex items-center gap-3">
            <Icon name="mdi:heart" /><span>{{ reactions.total }}</span>
          </div>
        </v-btn>
        <v-spacer />
        <v-btn
          flat
          rounded
          color="primary"
          variant="flat"
          @click="commentsVisible = true"
        >
          <div class="flex items-center gap-3">
            <Icon name="mdi:comment" /><span>{{ comments.total }}</span>
          </div>
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
    <div class="flex justify-end p-3">
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
      <VInfiniteScroll
        max-height="50vh"
        @load="loadMoreComments"
      >
        <template
          v-for="comment in comments.rows.toReversed()"
          :key="comment.id"
        >
          <div class="flex flex-col border-b px-2">
            <div
              class="flex items-center justify-center gap-3 py-1 text-xs font-thin text-white!"
            >
              <span class="overflow-clip">{{ comment!.comment }}</span>
              <v-spacer />
              <div
                class="flex flex-col items-end"
              >
                <span>{{ DateTime.fromMillis(comment!.created_at).toFormat('dd/MM/yyyy hh:mm:ss') }}</span>
                <span>{{ comment!.user_name }}</span>
              </div>
            </div>
          </div>
        </template>
        <template #empty>
          <span class="text-sm">Nie ma wiecej komentarzy</span>
        </template>
      </VInfiniteScroll>
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
