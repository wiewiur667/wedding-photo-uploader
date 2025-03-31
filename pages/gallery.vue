<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})
</script>

<template>
  <div class="flex flex-1 flex-col gap-3 bg-gray-100 px-1 py-1">
    <!-- Top photos -->
    <w-albums />
    <uploads-gallery />
  </div>
</template>
