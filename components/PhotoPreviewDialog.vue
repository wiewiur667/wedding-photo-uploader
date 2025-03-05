<script lang="ts" setup>
interface Props {
  target: {
    id: string
    name: string
  }
}

const props = defineProps<Props>()
const appStore = useAppStore()
const { userName, sessionId } = storeToRefs(appStore)

const { data: commentsData, refresh } = useAsyncData('comments', () => $fetch('/api/comments/:id', {
  params: {
    id: props.target.id,
  },
}))

const commentText = ref('')

async function saveComment() {
  await $fetch(`/api/comments/${props.target.id}`, {
    method: 'POST',
    body: JSON.stringify({
      comment: commentText.value,
      userName: userName.value,
      userSession: sessionId.value,
    }),
  })
  commentText.value = ''
  refresh()
}
</script>

<template>
  <v-card>
    <v-card-title>{{ props.target.name }}</v-card-title>
    <v-card-text>
      <NuxtImg
        :src="`http://localhost:3000/api/photos/${props.target.id}`"
        class="content h-full object-cover object-center"
        :alt="props.target.name"
      />
    </v-card-text>
    <v-card-text>
      {{ commentsData }}
    </v-card-text>
    <v-card-text>
      <v-text-field
        v-model="commentText"
        label="Komentarz"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="() => saveComment()">
        Wyslij
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style>

</style>
