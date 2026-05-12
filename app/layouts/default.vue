<script setup lang="ts"></script>

<template>
  <div class="min-h-dvh bg-[linear-gradient(to_bottom,#EFF9E8_0%,#F8FCF4_40%,#FAFAF5_100%)]">
    <main class="min-h-dvh pb-[calc(96px+env(safe-area-inset-bottom,0px))]">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>
