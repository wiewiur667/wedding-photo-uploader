<script lang="ts" setup>
const name = ref('')

definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="flex flex-1 flex-col justify-center items-center gap-3 p-8 font-sans! [&>*]:text-white!">
    <w-card class="gap-3 p-4 bg-transparent! shadow-none! opacity-95">
      <div class="text-xl mb-10 flex flex-col gap-8 items-center  ">
        <Icon name="emojione-monotone:wedding" size="5em" />
        <div class="flex flex-col gap-4 items-center tracking-widest! font-italic">
          <div class="text-3xl">
            Witamy na weselu
          </div>
          <span class="text-pink-300 text-3xl font-bold">Klaudii</span>
          <span>i</span>
          <span class="text-blue-400 text-3xl font-bold">Sebastiana</span>
        </div>
        <span class="self-start text-center">Tutaj mozesz wgrac, polubic lub przejzec zdjecia wgrane przez innych gosci </span>
      </div>

      <div class="flex flex-1 flex-col gap-3 mb-15">
        <span>Aby kontynuowac podaj swoja nazwe uzytkownika</span>
        <w-text-input v-model="name" class="w-full bg-black/20 border-none" placeholder="Nazwa uzytkownika" />
      </div>
      <w-btn
        label="Zaloguj"
        class="outline-amber-800/20 outline-2 outline bg-black/20 active:bg-black/50 text-white"
      />
    </w-card>
  </div>
</template>

<style>

</style>
