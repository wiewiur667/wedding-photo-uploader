<script lang="ts" setup>
const { data } = useFetch('/api/photos')
</script>

<template>
  <div>{{ data }}</div>
</template>

<style>

</style>
