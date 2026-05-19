<script setup lang="ts">
useHead({ title: '統計' })

const PRAY_GOAL = 60

const { $api } = useNuxtApp()

interface SchoolProgress { prayMinutes: number; spreadCount: number }
const raw = ref<Record<string, SchoolProgress>>({})
onMounted(async () => {
  const { data: progressDataList } = await $api.GET('/missions/progress', {
    params: {
      header: { 'X-Member-Id': useLocalStorage('userUuid', "").value }
    }
  })

  if (!progressDataList)
    return

  for (const p of progressDataList) {
    if (p.campus)
      raw.value[p.campus] = {
        prayMinutes: p.totalPrayerMinutes ?? 0, 
        spreadCount: p.totalEvangelismCount ?? 0
      }
  }
})

const schools = ['台大', '師大', '台科大'] as const
type School = typeof schools[number]

const pray   = (s: School) => raw.value[s]?.prayMinutes ?? 0
const spread = (s: School) => raw.value[s]?.spreadCount ?? 0
const pct    = (s: School) => Math.min(100, Math.round((pray(s) / PRAY_GOAL) * 100))

const totalSpread   = computed(() => schools.reduce((a, s) => a + spread(s), 0))
const unlockedCount = computed(() => schools.filter(s => pray(s) >= PRAY_GOAL && spread(s) >= 3).length)

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
        <div class="text-[2.2rem] font-black text-pk-brown leading-none">—</div>
        <div class="text-[0.75rem] font-semibold text-pk-brown-2">參與人數</div>
      </div>
      <div class="bg-white rounded-[22px] px-3.5 py-5 flex flex-col items-center gap-2
                  shadow-pk-card-sm border border-pk-border text-center">
        <div class="w-13 h-13 rounded-[16px] bg-pk-yellow-light flex items-center justify-center text-[1.5rem]">🏅</div>
        <div class="text-[2.2rem] font-black text-pk-green-dark leading-none">{{ unlockedCount }}</div>
        <div class="text-[0.75rem] font-semibold text-pk-brown-2">達標明信片</div>
      </div>
    </div>

    <!-- 各校禱告進度條 -->
    <div class="bg-white rounded-[22px] px-4 py-[18px] flex flex-col gap-4
                shadow-pk-card-sm border border-pk-border">
      <div class="flex items-center gap-2">
        <span class="text-[1.1rem]">🙏</span>
        <span class="flex-1 text-[0.95rem] font-extrabold text-pk-brown">各校總禱告時間</span>
        <span class="text-[0.72rem] font-semibold text-pk-brown-light whitespace-nowrap">目標 {{ PRAY_GOAL }} 分鐘</span>
      </div>
      <div v-for="s in schools" :key="s" class="flex flex-col gap-1.5">
        <div class="flex items-center gap-2">
          <span class="text-[0.72rem] font-extrabold px-2.5 py-0.5 rounded-full flex-shrink-0"
                :style="{ background: meta[s].bg, color: meta[s].color }">{{ s }}</span>
          <span class="flex-1 text-[0.92rem] font-extrabold text-pk-brown">
            {{ pray(s) }}<span class="text-[0.72rem] font-medium text-pk-brown-2 ml-0.5">分鐘</span>
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
          {{ totalSpread }}<span class="text-[0.8rem] font-semibold text-pk-brown-2 ml-0.5">次</span>
        </div>
      </div>
      <div class="border-t border-pk-cream-2 px-4 py-3 flex justify-around">
        <div v-for="s in schools" :key="s" class="flex flex-col items-center gap-1.5">
          <span class="text-[0.68rem] font-extrabold px-2 py-0.5 rounded-full"
                :style="{ background: meta[s].bg, color: meta[s].color }">{{ s }}</span>
          <span class="text-[0.88rem] font-extrabold text-pk-brown">{{ spread(s) }} 次</span>
        </div>
      </div>
    </div>
  </div>
</template>
