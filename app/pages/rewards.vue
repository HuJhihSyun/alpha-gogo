<script setup lang="ts">
useHead({
  title: '獎勵',
  meta: [{ name: 'description', content: '查看已解鎖的校園明信片，集滿三所大學即可完成活動。' }]
})

const { $api } = useNuxtApp()

import imgNtu   from '~/assets/images/ntu1.jpg'
import imgNtnu  from '~/assets/images/ntnu1.jpg'
import imgNtust from '~/assets/images/ntust1.jpeg'

const PRAY_GOAL = 60
const SPREAD_GOAL = 3

const schools = [
  { key: '台大',  label: '台灣大學',    short: 'NTU',   color: '#2E6BE6', bg: '#EAF1FF', bar: 'linear-gradient(90deg,#5B8FF9,#2E6BE6)', image: imgNtu   },
  { key: '師大',  label: '台灣師範大學', short: 'NTNU',  color: '#D4400B', bg: '#FFF0EA', bar: 'linear-gradient(90deg,#F4845F,#D4400B)', image: imgNtnu  },
  { key: '台科大', label: '台灣科技大學', short: 'NTUST', color: '#0E7A5A', bg: '#E5F7F0', bar: 'linear-gradient(90deg,#3DBFA0,#0E7A5A)', image: imgNtust },
] as const
type SchoolKey = '台大' | '師大' | '台科大'

interface Progress { prayMinutes: number; spreadCount: number }
const progress = ref<Record<string, Progress>>({})
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
      progress.value[p.campus] = {
        prayMinutes: p.totalPrayerMinutes ?? 0, 
        spreadCount: p.totalEvangelismCount ?? 0
      }
  }
})

const get  = (k: SchoolKey) => ({ prayMinutes: progress.value[k]?.prayMinutes ?? 0, spreadCount: progress.value[k]?.spreadCount ?? 0 })
const pPct = (k: SchoolKey) => Math.min(100, Math.round((get(k).prayMinutes / PRAY_GOAL)   * 100))
const sPct = (k: SchoolKey) => Math.min(100, Math.round((get(k).spreadCount / SPREAD_GOAL) * 100))
const ok   = (k: SchoolKey) => get(k).prayMinutes >= PRAY_GOAL && get(k).spreadCount >= SPREAD_GOAL
</script>

<template>
  <div class="flex flex-col gap-4 px-4 pt-5 font-pk">

    <!-- 頁首 -->
    <div class="flex flex-col gap-1 pb-1">
      <span class="inline-flex items-center gap-1.5 bg-pk-yellow-light text-[#8B6914]
                   text-[0.75rem] font-bold px-3 py-[5px] rounded-full w-fit">
        <span>🏆</span> 解鎖成就
      </span>
      <h1 class="text-[1.7rem] font-black text-pk-brown leading-tight">獎勵</h1>
      <p class="text-sm text-pk-brown-2">完成任務解鎖各學校專屬圖像</p>
    </div>

    <!-- 條件說明 -->
    <div class="bg-white rounded-[18px] px-4 py-3.5 flex items-center gap-3
                shadow-pk-card-sm border border-pk-border">
      <span class="text-[1.6rem]">🌿</span>
      <div>
        <p class="text-[0.82rem] font-extrabold text-pk-brown">解鎖條件</p>
        <p class="text-[0.75rem] text-pk-brown-2 mt-0.5">禱告滿 {{ PRAY_GOAL }} 分鐘 ＆ 傳道滿 {{ SPREAD_GOAL }} 次</p>
      </div>
    </div>

    <!-- 三張學校卡片 -->
    <div v-for="s in schools" :key="s.key"
         class="bg-white rounded-pk overflow-hidden shadow-pk-card border border-pk-border flex flex-col">

      <!-- 頂部色條 -->
      <div class="h-1.5 w-full" :style="{ background: s.color }" />

      <!-- 學校名稱 -->
      <div class="flex items-center gap-3 px-4 py-4">
        <div class="w-12 h-12 rounded-[14px] flex items-center justify-center
                    text-[0.72rem] font-black tracking-tight flex-shrink-0"
             :style="{ background: s.bg, color: s.color }">{{ s.short }}</div>
        <div>
          <p class="text-base font-black text-pk-brown">{{ s.key }}</p>
          <p class="text-[0.72rem] text-pk-brown-2 mt-0.5">{{ s.label }}</p>
        </div>
        <span v-if="ok(s.key)"
              class="ml-auto text-[0.72rem] font-extrabold bg-pk-green-light text-pk-green-dark
                     px-2.5 py-1 rounded-full whitespace-nowrap">
          ✓ 解鎖
        </span>
      </div>

      <!-- 禱告進度 -->
      <div class="flex flex-col gap-1.5 px-4 pb-3.5">
        <div class="flex items-center gap-1.5">
          <span class="text-[0.95rem]">🙏</span>
          <span class="flex-1 text-[0.8rem] font-bold text-pk-brown">禱告時間</span>
          <span class="text-[0.75rem] font-bold text-pk-brown-2 whitespace-nowrap">
            {{ get(s.key).prayMinutes }} / {{ PRAY_GOAL }} 分
          </span>
        </div>
        <div class="h-2.5 bg-pk-cream-2 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)]"
               :style="{ width: pPct(s.key) + '%', background: 'linear-gradient(90deg,#7CC94E,#4A8B30)' }" />
        </div>
      </div>

      <!-- 傳道進度 -->
      <div class="flex flex-col gap-1.5 px-4 pb-4">
        <div class="flex items-center gap-1.5">
          <span class="text-[0.95rem]">📢</span>
          <span class="flex-1 text-[0.8rem] font-bold text-pk-brown">傳道管理</span>
          <span class="text-[0.75rem] font-bold text-pk-brown-2 whitespace-nowrap">
            {{ get(s.key).spreadCount }} / {{ SPREAD_GOAL }} 次
          </span>
        </div>
        <div class="h-2.5 bg-pk-cream-2 rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(.34,1.56,.64,1)]"
               :style="{ width: sPct(s.key) + '%', background: 'linear-gradient(90deg,#F9CA24,#E0A800)' }" />
        </div>
      </div>

      <!-- 解鎖圖像 -->
      <div class="relative mx-3 mb-3 rounded-[18px] overflow-hidden border-2"
           :class="ok(s.key) ? 'border-transparent' : 'border-dashed border-pk-border bg-pk-cream'">
        <template v-if="ok(s.key)">
          <img :src="s.image" :alt="s.key" class="w-full h-[180px] object-cover block" />
          <div class="absolute inset-x-0 bottom-0 px-3.5 py-2 text-center
                      text-[0.82rem] font-extrabold text-white
                      bg-[rgba(0,0,0,.35)] backdrop-blur-sm">
            🎉 {{ s.key }} 圖像已解鎖！
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center gap-2 py-7">
            <span class="text-[2.4rem]">🔒</span>
            <p class="text-[0.8rem] font-semibold text-pk-brown-light">完成任務後解鎖</p>
            <div class="flex gap-1.5 mt-1">
              <span v-for="i in 3" :key="i"
                    class="w-2 h-2 rounded-full transition-colors duration-300"
                    :class="i <= Math.floor((pPct(s.key)+sPct(s.key))/2/34)
                      ? 'bg-pk-green' : 'bg-pk-border'" />
            </div>
          </div>
        </template>
      </div>

      <!-- 前往按鈕 -->
      <NuxtLink :to="`/records?school=${s.key}`"
                class="flex items-center justify-center gap-1.5
                       mx-3 mb-3.5 py-3.5 rounded-full border-2 font-extrabold text-[0.9rem]
                       bg-white no-underline transition-all duration-150 tap-transparent active:scale-95"
                :style="{ borderColor: s.color, color: s.color }">
        📝 前往登錄條件
      </NuxtLink>
    </div>
  </div>
</template>
