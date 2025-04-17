<script lang="ts" setup>
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { data: page } = await useAsyncData(() => {
  return queryCollection('content').path('/').first()
})

const userStore = useUserStore()
const { userName } = storeToRefs(userStore)
const data = computed(() => ({
  userName: userName.value,
}))
</script>

<template>
  <div class="flex items-center justify-center">
    <ContentRenderer
      v-if="page"
      class="p-6 prose"
      :data
      :value="page"
    />
  </div>
</template>

<style lang="scss">
@import url('~/assets/prose.scss');
</style>
