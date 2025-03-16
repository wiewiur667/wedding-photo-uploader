<script lang="ts" setup>
import type { IComment } from '~/code/interfaces/Comment.interface'
import type { IPagedResult } from '~/code/interfaces/PagedResult.interface'
import { orderBy, uniqBy } from 'lodash-es'
import { DateTime } from 'luxon'

interface Props {
  targetId: string
}

const props = defineProps<Props>()

defineExpose({
  open,
})

const { targetId } = toRefs(props)

const { mdAndUp } = useDisplay()

const commentText = ref('')

const comments = reactive({
  rows: [] as IComment[],
  total: 0,
  offset: 0,
  limit: 10,
  visible: false,
})

function open() {
  comments.visible = true
}

const { execute, refresh, status, data: commentsData } = useApi<IPagedResult<IComment>>(`/api/uploads/${targetId.value}/comment`, {
  immediate: false,
  method: 'GET',
  params: {
    offset: toRef(comments, 'offset'),
    limit: toRef(comments, 'limit'),
  },
  transform: (response: any) => {
    return {
      ...response,
      rows: response.rows.map((row: any) => ({
        fkUploadId: row.fk_upload_id,
        id: row.id,
        fkUserId: row.fk_user_id,
        comment: row.comment,
        userName: row.user_name,
        createdAt: DateTime.fromMillis(row.created_at),
      })),
    }
  },
})

watch(commentsData, (data) => {
  comments.rows = [...comments.rows, ...(data?.rows ?? [])]
  // comments.offset = comments.rows.length
  comments.total = data?.total ?? 0
}, {
  deep: true,
})

await execute()

async function addComment() {
  await $api(`/api/uploads/${targetId.value}/comment`, {
    body: JSON.stringify({
      comment: commentText.value,
    }),

    onRequest() {
      commentText.value = ''
    },
  })
  comments.offset = 0
  comments.limit = 10

  await refresh()
}

const commentsList = computed(() => {
  return uniqBy(orderBy(comments.rows, ['created_at'], ['desc']), 'id')
})

// await _loadComments()
</script>

<template>
  <v-bottom-sheet
    v-model="comments.visible"
    :inset="mdAndUp"
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        flat
        size="small"
        prepend-icon="mdi-comment-outline"
        :text="$t('skomentuj')"
        variant="text"
      />
    </template>
    <template #default>
      <div class="flex justify-end p-3">
        <v-btn
          color="error"
          flat
          icon
          density="compact"
          variant="flat"
          @click="comments.visible = false"
        >
          <Icon name="mdi:close" />
        </v-btn>
      </div>
      <v-card class="flex flex-col rounded-t-lg pt-2">
        <div class="max-h-[75vh] flex flex-col items-start gap-4 overflow-auto border-b px-2">
          <template
            v-for="comment in commentsList"
            :key="comment.id"
          >
            <div
              class="flex flex-col items-start gap-1 px-2 py-1 font-thin"
            >
              <div class="round flex items-center gap-3 rounded-lg bg-gray-100 p-2">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold!">{{ comment!.userName }}</span>
                  <span>{{ comment.comment }}</span>
                </div>
              </div>
              <span class="text-xs">{{ useTimeAgo(comment!.createdAt.toJSDate(), {
                messages: {
                  day: 'dzień',
                  hour: (n) => `${n} ${$t('timeAgo.hour', n).toLowerCase()}`,
                  minute: (n) => `${n} ${$t('timeAgo.minute', n).toLowerCase()}`,
                  month: (n) => `${n} ${$t('timeAgo.month', n).toLowerCase()}`,
                  second: (n) => `${n} ${$t('timeAgo.second', n).toLowerCase()}`,
                  year: (n) => `${n} ${$t('timeAgo.year', n).toLowerCase()}`,
                  future: 'za %s',
                  past: (n: string) => `${n} temu`,
                  week: (n) => `${n} ${$t('timeAgo.week', n).toLowerCase()}`,
                  justNow: 'przed chwilą',
                  invalid: 'nieprawidłowy',
                },
              }) }}</span>
            </div>
          </template>
        </div>
        <v-form
          class="flex items-center gap-3 p-3"
          validate-on="input"
          @submit.prevent="addComment"
        >
          <template #default="{ isValid }">
            <v-text-field
              v-model="commentText"
              class="flex-1"
              density="compact"
              variant="solo-filled"
              :placeholder="$t('komentarz')"
              hide-details
              flat
              :rules="[
                (v) => !!v || $t('validation.comment.isRequired'),
              ]"
            />
            <v-btn
              type="submit"
              flat
              density="compact"
              variant="plain"
              color="primary"
              icon="mdi-send"
              :disabled="!isValid.value || status === 'pending'"
            />
          </template>
        </v-form>
      </v-card>
    </template>
  </v-bottom-sheet>
</template>
