<script lang="ts" setup>
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})
const user = useUserStore()
const offset = ref(0)
const limit = ref(50)

const { execute } = getOffsetData('uploads', `api/uploads`, offset, limit)

execute()
</script>

<template>
  <div>
    {{ user }}
  </div>
</template>

<style>

</style>
