<script lang="ts" setup>
const { data } = useFetch('/api/photos/get', {
  method: 'get',
  query: {
    id: 7,
  },
})
</script>

<template>
  <div>
    {{ data }}
  </div>
</template>

<style>

</style>
