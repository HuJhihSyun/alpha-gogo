<script setup lang="ts">
const navItems = [
  { label: '首頁',  to: '/',        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>` },
  { label: '紀錄',  to: '/records', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 13h8v1.5H8zm0 3h8v1.5H8zm0-6h4v1.5H8z"/></svg>` },
  { label: '獎勵',  to: '/rewards', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0012 17a5.01 5.01 0 004.61-4.06C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/><path d="M11 19H9v2h6v-2h-2v-2h-2z"/></svg>` },
  { label: '回顧',  to: '/review',  svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` },
  { label: '統計',  to: '/stats',   svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>` },
  { label: '帳號',  to: '/profile', svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>` },
]
</script>

<template>
  <nav class="fixed bottom-4 left-3 right-3 z-50 flex items-center
              bg-white/[.97] backdrop-blur-md rounded-pk-lg
              px-1 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))]
              shadow-pk-nav">
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center gap-0.5 no-underline
             tap-transparent transition-transform duration-150 active:scale-90"
      exact-active-class="nav-active"
    >
      <span class="flex items-center justify-center w-7/10 h-7 rounded-full
                   transition-all duration-200 nav-pill">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="flex items-center justify-center w-5.5 h-5.5
                     text-pk-brown-light nav-icon" v-html="item.svg" />
      </span>
      <span class="text-[0.6rem] font-semibold tracking-wide text-pk-brown-light
                   whitespace-nowrap nav-label font-pk">
        {{ item.label }}
      </span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
/* 活躍狀態：橢圓底 + 綠色 icon/label */
.nav-active .nav-pill  { background: #EBF8DD; transform: scale(1.08); }
.nav-active .nav-icon  { color: #4A8B30; }
.nav-active .nav-label { color: #4A8B30; }
/* :deep for v-html SVG sizing */
.nav-icon :deep(svg) { width: 22px; height: 22px; }
</style>
