<script setup lang="ts">
useHead({
  title: '統計',
  meta: [{ name: 'description', content: '即時查看全體參與者的禱告時間、傳道次數與明信片解鎖進度。' }]
})

const PRAY_GOAL_MIN = 40 * 60   // 40 小時 = 2400 分鐘
const PRAY_GOAL_HR  = 40

const { $api } = useNuxtApp()

interface GlobalStats {
  totalParticipants: number
  totalEvangelism: number
  totalPostcardsUnlocked: number
  ntuTotalPrayer: number
  ntnuTotalPrayer: number
  ntustTotalPrayer: number
}

const stats = ref<GlobalStats>({
  totalParticipants: 0,
  totalEvangelism: 0,
  totalPostcardsUnlocked: 0,
  ntuTotalPrayer: 0,
  ntnuTotalPrayer: 0,
  ntustTotalPrayer: 0,
})

onMounted(async () => {
  const { data } = await $api.GET('/missions/stats/global', {})
  if (data) stats.value = data
})

const schools = ['台大', '師大', '台科大'] as const
type School = typeof schools[number]

const prayMap: Record<School, keyof GlobalStats> = {
  台大:  'ntuTotalPrayer',
  師大:  'ntnuTotalPrayer',
  台科大: 'ntustTotalPrayer',
}

const prayMin  = (s: School) => stats.value[prayMap[s]] as number
const prayHr   = (s: School) => (prayMin(s) / 60).toFixed(1)
const pct      = (s: School) => Math.min(100, Math.round((prayMin(s) / PRAY_GOAL_MIN) * 100))

const meta: Record<School, { color: string; bg: string; bar: string }> = {
  台大:  { color: '#2E6BE6', bg: '#EAF1FF', bar: 'linear-gradient(90deg,#5B8FF9,#2E6BE6)' },
  師大:  { color: '#D4400B', bg: '#FFF0EA', bar: 'linear-gradient(90deg,#F4845F,#D4400B)' },
  台科大: { color: '#0E7A5A', bg: '#E5F7F0', bar: 'linear-gradient(90deg,#3DBFA0,#0E7A5A)' },
}
</script>

<template>
  <div class="flex flex-col gap-3.5 px-4 pt-5 font-pk">

    <!-- 頁首 -->
    <div class="flex flex-col gap-1 pb-1">
      <span class="inline-flex items-center gap-1.5 bg-pk-green-light text-pk-green-dark
                   text-[0.75rem] font-bold px-3 py-[5px] rounded-full w-fit">
        <span>📊</span> 活動數據
      </span>
      <h1 class="text-[1.7rem] font-black text-pk-brown leading-tight">統計</h1>
      <p class="text-sm text-pk-brown-2">即時追蹤整體活動成效</p>
    </div>

    <!-- 兩欄指標 -->
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-[22px] px-3.5 py-5 flex flex-col items-center gap-2
                  shadow-pk-card-sm border border-pk-border text-center">
        <div class="w-13 h-13 rounded-[16px] bg-[#EAF1FF] flex items-center justify-center text-[1.5rem]">👥</div>
        <div class="text-[2.2rem] font-black text-pk-brown leading-none">{{ stats.totalParticipants }}</div>
        <div class="text-[0.75rem] font-semibold text-pk-brown-2">參與人數</div>
      </div>
      <div class="bg-white rounded-[22px] px-3.5 py-5 flex flex-col items-center gap-2
                  shadow-pk-card-sm border border-pk-border text-center">
        <div class="w-13 h-13 rounded-[16px] bg-pk-yellow-light flex items-center justify-center text-[1.5rem]">🏅</div>
        <div class="text-[2.2rem] font-black text-pk-green-dark leading-none">{{ stats.totalPostcardsUnlocked }}</div>
        <div class="text-[0.75rem] font-semibold text-pk-brown-2">達標明信片</div>
      </div>
    </div>

    <!-- 各校禱告進度條 -->
    <div class="bg-white rounded-[22px] px-4 py-[18px] flex flex-col gap-4
                shadow-pk-card-sm border border-pk-border">
      <div class="flex items-center gap-2">
        <span class="text-[1.1rem]">🙏</span>
        <span class="flex-1 text-[0.95rem] font-extrabold text-pk-brown">各校總禱告時間</span>
        <span class="text-[0.72rem] font-semibold text-pk-brown-light whitespace-nowrap">目標 {{ PRAY_GOAL_HR }} 小時</span>
      </div>
      <div v-for="s in schools" :key="s" class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <span class="text-[0.72rem] font-extrabold px-2.5 py-0.5 rounded-full flex-shrink-0"
                :style="{ background: meta[s].bg, color: meta[s].color }">{{ s }}</span>
          <span class="flex-1 text-[0.92rem] font-extrabold text-pk-brown">
            {{ prayHr(s) }}<span class="text-[0.72rem] font-medium text-pk-brown-2 ml-0.5">小時</span>
          </span>
          <span class="text-[0.72rem] font-bold text-pk-brown-2 min-w-[34px] text-right">{{ pct(s) }}%</span>
        </div>
        <div class="h-2.5 bg-pk-cream-2 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)]"
               :style="{ width: pct(s) + '%', background: meta[s].bar }" />
        </div>
      </div>
    </div>

    <!-- 總傳道次數 -->
    <div class="bg-white rounded-[22px] overflow-hidden shadow-pk-card-sm border border-pk-border">
      <div class="flex items-center gap-3.5 px-4 pt-[18px] pb-3.5">
        <div class="w-13 h-13 rounded-[16px] bg-pk-yellow-light flex items-center justify-center text-[1.5rem] flex-shrink-0">📢</div>
        <div class="flex-1">
          <p class="text-[0.95rem] font-extrabold text-pk-brown">總傳道次數</p>
          <p class="text-[0.72rem] text-pk-brown-2 mt-0.5">三所學校累積傳道總計</p>
        </div>
        <div class="text-[2.2rem] font-black text-pk-green-dark leading-none flex-shrink-0">
          {{ stats.totalEvangelism }}<span class="text-[0.8rem] font-semibold text-pk-brown-2 ml-0.5">次</span>
        </div>
      </div>
    </div>
  </div>
</template>
