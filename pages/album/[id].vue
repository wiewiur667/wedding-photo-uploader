<script lang="ts" setup>
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})

const { id } = useRoute().params

const { getUserAlbum } = useUploads()

const dataFn = getUserAlbum(id as string)
await dataFn.execute()
</script>

<template>
  <div class="flex flex-col gap-3 py-3">
    <v-btn
      class="flex-none"
      :to="{ name: 'gallery' }"
      variant="text"
      color="primary"
      :rounded="false"
    >
      Powrot
    </v-btn>
    Album Uzytkownika
    <uploads-gallery :data-fn />
  </div>
</template>

<style>

</style>
