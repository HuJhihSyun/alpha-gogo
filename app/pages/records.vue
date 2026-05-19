<script setup lang="ts">
  useHead({ title: '紀錄' })

  const { $api } = useNuxtApp()

  const tabs = ['台大', '師大', '台科大'] as const
  type Tab = (typeof tabs)[number]

  const route = useRoute()
  const initialTab = computed<Tab>(() => {
    const q = route.query.school
    if (q === '台大' || q === '師大' || q === '台科大') return q
    return '台大'
  })
  const activeTab = ref<Tab>(initialTab.value)
  watch(initialTab, (v) => {
    activeTab.value = v
  })

  interface FormData {
    prayMinutes: number | null
    spreadCount: number | null
    reflection: string
  }
  const forms = reactive<Record<Tab, FormData>>({
    台大: { prayMinutes: null, spreadCount: null, reflection: '' },
    師大: { prayMinutes: null, spreadCount: null, reflection: '' },
    台科大: { prayMinutes: null, spreadCount: null, reflection: '' }
  })
  const current = computed(() => forms[activeTab.value])

  const submitting = ref(false)
  const submitMsg = ref('')
  const submitOk = ref(false)

  async function handleSubmit() {
    submitMsg.value = ''
    const f = current.value
    if (f.prayMinutes === null || f.prayMinutes < 0) {
      submitMsg.value = '請填寫禱告時間（分鐘）'
      submitOk.value = false
      return
    }
    if (f.spreadCount === null || f.spreadCount < 0) {
      submitMsg.value = '請填寫傳道管理次數'
      submitOk.value = false
      return
    }
    if (!f.reflection.trim()) {
      submitMsg.value = '請填寫今日體會'
      submitOk.value = false
      return
    }

    submitting.value = true
    await new Promise((r) => setTimeout(r, 800))

    const { data: { success } = {} } = await $api.POST('/missions/record', {
      params: {
        header: {
          'X-Member-Id': useLocalStorage('userUuid', '').value
        }
      }, 
      body: {
        campus: activeTab.value, 
        prayerMinutes: f.prayMinutes,
        evangelismCount: f.spreadCount, 
        realization: f.reflection
      }
    })

    if (!success) {
      submitting.value = false
      submitOk.value = false
      submitMsg.value = '上傳失敗，請稍後再試'
      return
    }

    const school = activeTab.value

    submitting.value = false
    submitOk.value = true
    submitMsg.value = `✅ ${school} 的紀錄已上傳！`
    Object.assign(forms[school], { prayMinutes: null, spreadCount: null, reflection: '' })
  }

  const content = computed(() => {
    switch (activeTab.value) {
      case '台大':
        return {
          title: '台灣大學 NTU 阿拉法條件登錄',
          history:
            '歷史足跡：1995.12.3主日，老師在台大分部以大型圖表傳達〈歷史論〉，揭露神的時機，並給予signing「生命救援」。當天台灣會員從50人倍增成250人。',
          slogan: '2026 阿拉法節，我們也以實踐興起生命救援的神蹟吧!'
        }
      case '師大':
        return {
          title: '師範大學 NTNU 阿拉法條件登錄',
          history:
            '歷史足跡：1995.12.10主日，老師給了師大signing「地上天國」，下午就來到師大分部操場，帶大家踢足球，天空中神以約定的彩虹出現，與台灣會員同在。',
          slogan: '2026 阿拉法節，我們一起用身體奔跑，實現地上天國!'
        }
      case '台科大':
        return {
          title: '台灣科技大學 NTUST 阿拉法條件登錄',
          history:
            '歷史足跡：1995，老師在台科大以大型圖表，現場傳達〈歷史論〉，帥氣揭露神的時機，並給予signing「真理自由」。後來，台灣從250人倍增成600人。',
          slogan: '2026 阿拉法節，我們要用最棒的真理，讓生命暴增!'
        }
    }
  })
</script>

<template>
  <div class="flex flex-col gap-3.5 px-4 pt-5 pb-2 font-pk">
    <!-- 頁首 -->
    <div class="flex flex-col gap-1 pb-1">
      <span
        class="inline-flex items-center gap-1.5 bg-pk-green-light text-pk-green-dark text-[0.75rem] font-bold px-3 py-[5px] rounded-full w-fit"
      >
        <span>📋</span> 活動紀錄
      </span>
      <h1 class="text-[1.7rem] font-black text-pk-brown leading-tight">紀錄</h1>
      <p class="text-sm text-pk-brown-2">記錄今日的探索與體會</p>
    </div>

    <!-- 學校標籤 -->
    <div
      class="flex gap-2 bg-white p-1.5 rounded-pk shadow-[0_2px_12px_rgba(74,139,48,.09),_0_1px_3px_rgba(61,43,31,.06)] border border-pk-border"
    >
      <button
        v-for="tab in tabs"
        :key="tab"
        class="flex-1 py-2.5 rounded-xl border-none text-[0.9rem] font-bold font-pk transition-all duration-200 tap-transparent active:scale-95 cursor-pointer"
        :class="
          activeTab === tab
            ? 'bg-pk-green-light text-pk-green-dark shadow-[0_2px_8px_rgba(74,139,48,.15)]'
            : 'bg-transparent text-pk-brown-light'
        "
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <div class="flex flex-col gap-1">
      <h4 class="text-base font-bold text-pk-brown">{{ content.title }}</h4>
      <p class="text-xs font-extrabold text-pk-brown">{{ content.history }}</p>
      <p class="text-xs font-extrabold text-pk-brown">{{ content.slogan }}</p>
    </div>

    <!-- 表單 (key 切換動畫) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0 translate-y-2.5"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1.5"
      mode="out-in"
    >
      <div :key="activeTab" class="flex flex-col gap-3">
        <!-- 禱告時間 -->
        <div class="bg-white rounded-[22px] px-4 py-4 flex flex-col gap-3.5 shadow-pk-card-sm border border-pk-border">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-pk-green-light flex items-center justify-center text-[1.4rem] shrink-0">
              🙏
            </div>
            <div>
              <p class="text-[0.95rem] font-extrabold text-pk-brown">禱告時間</p>
              <p class="text-[0.75rem] text-pk-brown-2 mt-0.5">今日禱告了多少分鐘？</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <button
              class="w-10 h-10 rounded-full border-2 border-pk-border bg-pk-cream text-[1.1rem] font-bold text-pk-green flex items-center justify-center shrink-0 transition-all duration-150 tap-transparent active:scale-90 disabled:text-pk-border disabled:cursor-not-allowed cursor-pointer"
              :disabled="!current.prayMinutes"
              @click="current.prayMinutes = Math.max(0, (current.prayMinutes ?? 0) - 5)"
            >
              －
            </button>
            <div class="flex-1 flex items-baseline gap-1.5 bg-[#F7FCF4] border-2 border-[#D4EEC4] rounded-xl px-3 py-1">
              <input
                v-model.number="current.prayMinutes"
                type="number"
                min="0"
                max="999"
                placeholder="0"
                class="flex-1 bg-transparent border-none text-2xl font-black text-pk-green-dark font-pk outline-none text-center w-0 min-w-0"
              />
              <span class="text-[0.82rem] font-semibold text-pk-brown-2 whitespace-nowrap">分鐘</span>
            </div>
            <button
              class="w-10 h-10 rounded-full border-2 border-pk-border bg-pk-cream text-[1.1rem] font-bold text-pk-green flex items-center justify-center shrink-0 transition-all duration-150 tap-transparent active:scale-90 cursor-pointer"
              @click="current.prayMinutes = (current.prayMinutes ?? 0) + 5"
            >
              ＋
            </button>
          </div>
        </div>

        <!-- 傳道次數 -->
        <div
          class="bg-white rounded-[22px] px-4 py-[18px] flex flex-col gap-3.5 shadow-pk-card-sm border border-pk-border"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-11 h-11 rounded-xl bg-pk-yellow-light flex items-center justify-center text-[1.4rem] shrink-0"
            >
              📢
            </div>
            <div>
              <p class="text-[0.95rem] font-extrabold text-pk-brown">傳道管理次數</p>
              <p class="text-[0.75rem] text-pk-brown-2 mt-0.5">今日傳道給管理的次數</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <button
              class="w-10 h-10 rounded-full border-2 border-pk-border bg-pk-cream text-[1.1rem] font-bold text-pk-green flex items-center justify-center flex-shrink-0 transition-all duration-150 tap-transparent active:scale-90 disabled:text-pk-border disabled:cursor-not-allowed cursor-pointer"
              :disabled="!current.spreadCount"
              @click="current.spreadCount = Math.max(0, (current.spreadCount ?? 0) - 1)"
            >
              －
            </button>
            <div class="flex-1 flex items-baseline gap-1.5 bg-[#F7FCF4] border-2 border-[#D4EEC4] rounded-xl px-3 py-1">
              <input
                v-model.number="current.spreadCount"
                type="number"
                min="0"
                max="99"
                placeholder="0"
                class="flex-1 bg-transparent border-none text-2xl font-black text-pk-green-dark font-pk outline-none text-center w-0 min-w-0"
              />
              <span class="text-[0.82rem] font-semibold text-pk-brown-2 whitespace-nowrap">次</span>
            </div>
            <button
              class="w-10 h-10 rounded-full border-2 border-pk-border bg-pk-cream text-[1.1rem] font-bold text-pk-green flex items-center justify-center shrink-0 transition-all duration-150 tap-transparent active:scale-90 cursor-pointer"
              @click="current.spreadCount = (current.spreadCount ?? 0) + 1"
            >
              ＋
            </button>
          </div>
        </div>

        <!-- 今日體會 -->
        <div
          class="bg-white rounded-[22px] px-4 py-[18px] flex flex-col gap-3.5 shadow-pk-card-sm border border-pk-border"
        >
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-[#E0F4FF] flex items-center justify-center text-[1.4rem] shrink-0">
              📝
            </div>
            <div>
              <p class="text-[0.95rem] font-extrabold text-pk-brown">今日體會</p>
              <p class="text-[0.75rem] text-pk-brown-2 mt-0.5">分享今天的感受與領受</p>
            </div>
          </div>
          <textarea
            v-model="current.reflection"
            rows="4"
            maxlength="500"
            placeholder="今天有什麼特別的體會或感動呢…"
            class="w-full px-2 py-1 rounded-pk-sm border-2 border-pk-border bg-pk-cream text-[0.92rem] text-pk-brown font-pk leading-relaxed resize-none outline-none placeholder:text-pk-brown-light focus:border-pk-green focus:bg-white transition-colors duration-150"
          />
          <p class="text-right text-[0.72rem] text-pk-brown-light -mt-2">{{ current.reflection.length }} / 500</p>
        </div>

        <!-- 提示訊息 -->
        <Transition
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          leave-to-class="opacity-0"
        >
          <div
            v-if="submitMsg"
            class="px-4 py-3 rounded-xl text-[0.85rem] font-semibold font-pk"
            :class="
              submitOk
                ? 'bg-pk-green-light text-pk-green-dark border border-[#A5D65A]'
                : 'bg-[#FFF3E0] text-[#8B4500] border border-[#FFCC80]'
            "
          >
            {{ submitMsg }}
          </div>
        </Transition>

        <!-- 送出按鈕 -->
        <button
          class="w-full flex items-center justify-center gap-2.5 py-[17px] mb-2 rounded-full border-none bg-[linear-gradient(135deg,#7CC94E,#5A9E32)] text-white text-[1.05rem] font-extrabold tracking-wide font-pk shadow-pk-btn transition-all duration-150 tap-transparent active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="submitting"
          @click="handleSubmit"
        >
          <span v-if="!submitting">🌿 上傳紀錄</span>
          <span v-else class="animate-spin">⏳</span>
        </button>
      </div>
    </Transition>
  </div>
</template>
