<script setup lang="ts">
definePageMeta({
  layout: 'main',
  middleware: ['authenticated'],
})
</script>

<template>
  <div class="flex flex-1 flex-col from-slate-50 to-slate-400 bg-gradient-to-b px-1 py-1">
    <!-- Top photos -->
    <w-albums />
    <uploads-gallery />
  </div>
</template>
