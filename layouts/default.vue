<template>
  <main class="h-full w-full flex flex-col font-sans!">
    <div class="z-1 flex flex-1 flex-col">
      <slot />
    </div>
    <div class="background__container" />
  </main>
</template>

<style lang="scss">
.background__container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../public/assets/background.png');
  background-size: cover;
  background-repeat: none;
  background-position: center center;
  filter:blur(10px) sepia(0.2) brightness(0.2);
}
</style>
