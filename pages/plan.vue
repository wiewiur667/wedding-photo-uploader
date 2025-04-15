<script lang="ts" setup>
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { data: page } = await useAsyncData(() => {
  return queryCollection('content').path('/plan').first()
})

const userStore = useUserStore()
const { userName } = storeToRefs(userStore)
const data = computed(() => ({
  userName: userName.value,
}))
</script>

<template>
  <ContentRenderer
    v-if="page"
    class="prose"
    :data
    :value="page"
  />
</template>

<style lang="scss">
@import url('~/assets/prose.scss');
</style>
