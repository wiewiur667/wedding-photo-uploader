<script lang="ts" setup>
const { data, execute } = useAsyncDataApi('albums', '/api/albums')

execute()
</script>

<template>
  <div class="min-w-0 flex flex-1 gap-3 overflow-auto bg-white p-4">
    <div
      v-for="album in data"
      :key="album.id"
      class="w-+0! flex-none h-20!"
    >
      <v-img
        :src="`/api/uploads/${album.id}`"
        :alt="album.userName"

        cover
        rounded
      />
    </div>
  </div>
</template>

<style>

</style>
