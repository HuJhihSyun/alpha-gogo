<script setup lang="ts">
useHead({
  title: '回顧',
  meta: [{ name: 'description', content: '歷史體會回顧 — 累積的感動與見證都會集中在這裡。' }]
})

const { $api } = useNuxtApp()

interface Realization {
  campus: string
  realization: string
  createdAt: string
}

const items = ref<Realization[]>([])
const loading = ref(true)
const hasError = ref(false)

onMounted(async () => {
  try {
    const { data } = await $api.GET('/missions/realizations', {
      params: {
        header: { 'X-Member-Id': useLocalStorage('userUuid', '').value }
      }
    })
    items.value = data ?? []
  } catch {
    hasError.value = true
  } finally {
    loading.value = false
  }
})

const schoolMeta: Record<string, { color: string; bg: string }> = {
  台大:  { color: '#2E6BE6', bg: '#EAF1FF' },
  師大:  { color: '#D4400B', bg: '#FFF0EA' },
  台科大: { color: '#0E7A5A', bg: '#E5F7F0' },
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const m = d.getMonth() + 1
  const day = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${m}/${day} ${hh}:${mm}`
}

const isEmpty = computed(() => !loading.value && !hasError.value && items.value.length === 0)
</script>

<template>
  <div class="flex flex-col gap-3.5 px-4 pt-5 font-pk">

    <!-- 頁首 -->
    <div class="flex flex-col gap-1 pb-1">
      <span class="inline-flex items-center gap-1.5 bg-[#FFF0F5] text-[#C0396B]
                   text-[0.75rem] font-bold px-3 py-[5px] rounded-full w-fit">
        <span>💝</span> 感動紀錄
      </span>
      <h1 class="text-[1.7rem] font-black text-pk-brown leading-tight">歷史體會回顧</h1>
      <p class="text-sm text-pk-brown-2">累積的感動與見證都會集中在這裡</p>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="flex flex-col gap-3">
      <div v-for="i in 3" :key="i"
           class="bg-white rounded-[20px] px-4 py-4 border border-pk-border shadow-pk-card-sm animate-pulse">
        <div class="flex items-center gap-2 mb-3">
          <div class="w-12 h-5 rounded-full bg-pk-cream-2" />
          <div class="w-20 h-4 rounded bg-pk-cream-2 ml-auto" />
        </div>
        <div class="w-full h-4 rounded bg-pk-cream-2 mb-2" />
        <div class="w-3/4 h-4 rounded bg-pk-cream-2" />
      </div>
    </div>

    <!-- 體會列表 -->
    <div v-else-if="items.length > 0" class="flex flex-col gap-3">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="bg-white rounded-[20px] px-4 py-4 border border-pk-border shadow-pk-card-sm"
      >
        <div class="flex items-center gap-2 mb-2.5">
          <span
            class="text-[0.7rem] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0"
            :style="{ background: (schoolMeta[item.campus] ?? schoolMeta['台大']).bg, color: (schoolMeta[item.campus] ?? schoolMeta['台大']).color }"
          >
            {{ item.campus }}
          </span>
          <span class="ml-auto text-[0.7rem] font-medium text-pk-brown-light whitespace-nowrap">
            {{ formatDate(item.createdAt) }}
          </span>
        </div>
        <p class="text-[0.92rem] text-pk-brown leading-relaxed">{{ item.realization }}</p>
      </div>
    </div>

    <!-- 空白 / 錯誤狀態 -->
    <div
      v-else
      class="bg-white rounded-[22px] px-5 py-10 flex flex-col items-center gap-4
             border border-pk-border shadow-pk-card-sm text-center"
    >
      <div class="w-16 h-16 rounded-full bg-[#FFF0F5] flex items-center justify-center text-[2rem]">
        💭
      </div>
      <div class="flex flex-col gap-1">
        <p class="text-[0.95rem] font-extrabold text-pk-brown">目前還沒有紀錄任何體會喔！</p>
        <p class="text-[0.8rem] text-pk-brown-2">登錄條件時填入體會，就會出現在這裡</p>
      </div>
      <NuxtLink
        to="/records"
        class="flex items-center gap-2 px-6 py-3.5 rounded-full no-underline
               bg-[linear-gradient(135deg,#7CC94E,#5A9E32)] text-white
               text-[0.9rem] font-extrabold shadow-pk-btn
               transition-transform duration-150 tap-transparent active:scale-95"
      >
        <span>📝</span> 前往登錄條件
      </NuxtLink>
    </div>

  </div>
</template>
