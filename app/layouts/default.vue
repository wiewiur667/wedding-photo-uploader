<template>
  <main class="h-full w-full flex flex-col">
    <div class="z-1 flex flex-1 flex-col">
      <slot />
    </div>
  </main>
</template>

<style lang="scss">
main {
  background-image: url('../../public/assets/background.png');
  background-size: cover;
  background-blend-mode: color-burn;
  background-repeat: none;
  background-position: center center;
}
</style>
