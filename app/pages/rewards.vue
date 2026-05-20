<script setup lang="ts">
useHead({
  title: '獎勵',
  meta: [{ name: 'description', content: '查看已解鎖的校園明信片，集滿三所大學即可完成活動。' }]
})

const { $api } = useNuxtApp()

import imgNtuPray   from '~/assets/images/ntu_pray.jpg'
import imgNtuEvan   from '~/assets/images/ntu_evan.jpg'
import imgNtnuPray  from '~/assets/images/ntnu_pray.jpg'
import imgNtnuEvan  from '~/assets/images/ntnu_evan.jpg'
import imgNtustPray from '~/assets/images/ntust_pray.jpg'
import imgNtustEvan from '~/assets/images/ntust_evan.jpg'

const PRAY_GOAL = 30
const SPREAD_GOAL = 1

const schools = [
  { key: '台大',   label: '台灣大學',    short: 'NTU',   color: '#2E6BE6', bg: '#EAF1FF', prayImage: imgNtuPray,   evanImage: imgNtuEvan   },
  { key: '師大',   label: '台灣師範大學', short: 'NTNU',  color: '#D4400B', bg: '#FFF0EA', prayImage: imgNtnuPray,  evanImage: imgNtnuEvan  },
  { key: '台科大', label: '台灣科技大學', short: 'NTUST', color: '#0E7A5A', bg: '#E5F7F0', prayImage: imgNtustPray, evanImage: imgNtustEvan },
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

const get      = (k: SchoolKey) => ({ prayMinutes: progress.value[k]?.prayMinutes ?? 0, spreadCount: progress.value[k]?.spreadCount ?? 0 })
const pPct     = (k: SchoolKey) => Math.min(100, Math.round((get(k).prayMinutes / PRAY_GOAL)   * 100))
const sPct     = (k: SchoolKey) => Math.min(100, Math.round((get(k).spreadCount / SPREAD_GOAL) * 100))
const prayOk   = (k: SchoolKey) => get(k).prayMinutes >= PRAY_GOAL
const evanOk   = (k: SchoolKey) => get(k).spreadCount >= SPREAD_GOAL
const anyOk    = (k: SchoolKey) => prayOk(k) || evanOk(k)

// 每所學校各自的切換狀態：'pray' | 'evan'
const activeTab = ref<Record<string, 'pray' | 'evan'>>({
  '台大': 'pray', '師大': 'pray', '台科大': 'pray'
})
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
    <div class="bg-white rounded-[18px] px-4 py-3.5 flex items-start gap-3
                shadow-pk-card-sm border border-pk-border">
      <span class="text-[1.6rem] mt-0.5">🌿</span>
      <div class="flex flex-col gap-1">
        <p class="text-[0.82rem] font-extrabold text-pk-brown">解鎖條件（各校獨立計算）</p>
        <p class="text-[0.75rem] text-pk-brown-2">🙏 禱告明信片：禱告滿 {{ PRAY_GOAL }} 分鐘</p>
        <p class="text-[0.75rem] text-pk-brown-2">📢 傳道明信片：傳道滿 {{ SPREAD_GOAL }} 次</p>
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
        <div v-if="anyOk(s.key)" class="ml-auto flex flex-col items-end gap-1">
          <span v-if="prayOk(s.key)"
                class="text-[0.7rem] font-extrabold bg-pk-green-light text-pk-green-dark
                       px-2 py-0.5 rounded-full whitespace-nowrap">
            🙏 禱告解鎖
          </span>
          <span v-if="evanOk(s.key)"
                class="text-[0.7rem] font-extrabold bg-pk-yellow-light text-[#7A5C00]
                       px-2 py-0.5 rounded-full whitespace-nowrap">
            📢 傳道解鎖
          </span>
        </div>
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
      <div class="mx-3 mb-3 rounded-[18px] overflow-hidden border border-pk-border flex flex-col">
        <!-- 切換 tab（永遠顯示） -->
        <div class="flex border-b border-pk-border bg-pk-cream">
          <button v-for="tab in [{ id: 'pray', label: '🙏 禱告' }, { id: 'evan', label: '📢 傳道' }]"
                  :key="tab.id"
                  class="flex-1 py-1 text-[0.78rem] font-extrabold transition-colors duration-150"
                  :class="activeTab[s.key] === tab.id
                    ? 'text-white'
                    : 'text-pk-brown-2 hover:bg-pk-cream-2'"
                  :style="activeTab[s.key] === tab.id ? { background: s.color } : {}"
                  @click="activeTab[s.key] = tab.id as 'pray' | 'evan'">
            {{ tab.label }}
          </button>
        </div>
        <!-- 禱告圖 / 鎖定 -->
        <template v-if="activeTab[s.key] === 'pray'">
          <div v-if="prayOk(s.key)" class="relative">
            <img :src="s.prayImage" :alt="s.key + ' 禱告'" class="w-full h-[200px] object-cover block" />
            <div class="absolute inset-x-0 bottom-0 px-3.5 py-1 text-center
                        text-xs font-extrabold text-white
                        bg-[rgba(0,0,0,.35)] backdrop-blur-sm">
              🎉 {{ s.key }}・禱告明信片已解鎖！
            </div>
          </div>
          <div v-else class="flex flex-col items-center gap-1 py-7 bg-pk-cream">
            <span class="text-[2.4rem]">🔒</span>
            <p class="text-[0.8rem] font-semibold text-pk-brown-light">禱告滿 {{ PRAY_GOAL }} 分鐘後解鎖</p>
            <p class="text-[0.72rem] text-pk-brown-light">目前 {{ get(s.key).prayMinutes }} 分鐘</p>
          </div>
        </template>
        <!-- 傳道圖 / 鎖定 -->
        <template v-else>
          <div v-if="evanOk(s.key)" class="relative">
            <img :src="s.evanImage" :alt="s.key + ' 傳道'" class="w-full h-[200px] object-cover block" />
            <div class="absolute inset-x-0 bottom-0 px-3.5 py-1 text-center
                        text-xs font-extrabold text-white
                        bg-[rgba(0,0,0,.35)] backdrop-blur-sm">
              🎉 {{ s.key }}・傳道明信片已解鎖！
            </div>
          </div>
          <div v-else class="flex flex-col items-center gap-1 py-7 bg-pk-cream">
            <span class="text-[2.4rem]">🔒</span>
            <p class="text-[0.8rem] font-semibold text-pk-brown-light">傳道滿 {{ SPREAD_GOAL }} 次後解鎖</p>
            <p class="text-[0.72rem] text-pk-brown-light">目前 {{ get(s.key).spreadCount }} 次</p>
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
