<script lang="ts" setup>
const { data, execute } = useAsyncDataApi<any>('albums', '/api/albums')

execute()

const slideGroupModel = ref(0)
</script>

<template>
  <v-sheet
    class="flex flex-none bg-gray-100!"
  >
    <v-slide-group
      v-model="slideGroupModel"
      selected-class="bg-primary"
      center-active
    >
      <v-slide-group-item
        v-for="album in data"
        :key="album.id"
      >
        <div class="relative mx-2 cursor-pointer rounded-lg">
          <v-img
            :src="`/api/uploads/${album.id}`"
            :alt="album.userName"
            width="8rem"
            :aspect-ratio="9 / 12"
            position="center"
            cover
          />
          <div class="p-2 pl-0 text-xs text-gray-600 font-thin">
            {{ album.userName }}
          </div>
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<style>

</style>
