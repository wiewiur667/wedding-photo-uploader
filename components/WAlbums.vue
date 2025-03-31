<script lang="ts" setup>
const { data, execute } = useAsyncDataApi<any>('albums', '/api/albums')

execute()
</script>

<template>
  <div class="flex flex-col">
    asdasd
    <div class="min-w-0 flex flex-1 gap-6 overflow-auto bg-white p-4 active:bg-gray-100">
      <div
        v-for="album in data"
        :key="album.id"
        class="relative z-0 flex flex-none flex-col gap-1"
      >
        <v-img
          :src="`/api/uploads/${album.id}`"
          :alt="album.userName"
          width="8rem"
          :aspect-ratio="16 / 9"
          position="center"
          cover
          rounded
        />
        <div class="absolute aspect-ratio-16/9 w-32 rotate-2 rounded bg-gray-200 -z-1">
    &nbsp;
        </div>
        <div class="absolute aspect-ratio-16/9 w-32 rotate-3 rounded bg-gray-300 -z-2">
    &nbsp;
        </div>
        <div class="absolute aspect-ratio-16/9 w-32 rounded bg-gray-400 -z-3 -rotate-3">
    &nbsp;
        </div>
        <div class="text-right text-xs text-gray-600 font-thin">
          {{ album.userName }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>

</style>
