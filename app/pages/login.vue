<script setup lang="ts">
  definePageMeta({ layout: false })

  interface UserProfile {
    department: string
    name: string
    gender: string
  }
  const existingUser = ref<UserProfile | null>(null)
  const showForm = ref(false)
  const form = reactive<UserProfile>({ department: '', name: '', gender: '' })
  const formError = ref('')

  const departments = ['長年部', '家庭局', '青年部', '大學部', '國高中部', '銀河水']
  const genders = ['男', '女']

  onMounted(() => {
    const stored = localStorage.getItem('user_profile')
    if (stored) {
      try {
        existingUser.value = JSON.parse(stored)
      } catch {}
    }
  })

  function continuePlay() {
    if (!existingUser.value) return
    sessionStorage.setItem('session_active', '1')
    navigateTo('/')
  }
  function toggleNewStart() {
    showForm.value = !showForm.value
    formError.value = ''
    if (!showForm.value) Object.assign(form, { department: '', name: '', gender: '' })
  }
  function startActivity() {
    formError.value = ''
    if (!form.department) {
      formError.value = '請選擇你的部門'
      return
    }
    if (!form.name.trim()) {
      formError.value = '請輸入你的名字'
      return
    }
    if (!form.gender) {
      formError.value = '請選擇性別'
      return
    }
    const profile: UserProfile = { department: form.department, name: form.name.trim(), gender: form.gender }
    localStorage.setItem('user_profile', JSON.stringify(profile))
    sessionStorage.setItem('session_active', '1')
    navigateTo('/')
  }
</script>

<template>
  <div
    class="relative min-h-dvh overflow-hidden flex items-center justify-center px-5 pt-5 pb-10 font-pk bg-[linear-gradient(180deg,#B8E0FF_0%,#CBF0C8_45%,#DFF5CC_70%,#F5FCF0_100%)]"
  >
    <!-- 雲朵裝飾 -->
    <div class="cloud cloud--1" />
    <div class="cloud cloud--2" />
    <div class="cloud cloud--3" />

    <!-- 草地底 -->
    <div
      class="absolute -bottom-5 -left-5 -right-5 h-24 bg-[radial-gradient(ellipse_at_50%_100%,#8BC34A_0%,#A5D65A_50%,transparent_100%)] opacity-35 pointer-events-none"
    />

    <!-- 小花裝飾 -->
    <div class="absolute inset-0 pointer-events-none">
      <span class="flower flower--1 absolute text-2xl">🌸</span>
      <span class="flower flower--2 absolute text-2xl">🌼</span>
      <span class="flower flower--3 absolute text-2xl">🌺</span>
      <span class="flower flower--4 absolute text-xl">🌻</span>
    </div>

    <!-- 主內容 -->
    <div class="relative z-10 w-full max-w-sm flex flex-col items-center gap-5">
      <!-- Title 圖片 -->
      <img src="@/assets/images/title.png" alt="Alpha GoGo" class="w-full select-none" />

      <!-- 已存檔用戶 Badge -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div
          v-if="existingUser && !showForm"
          class="flex items-center gap-3 w-full bg-white/[.88] backdrop-blur-md border border-[rgba(106,176,76,.25)] rounded-[20px] px-4 py-3 shadow-[0_4px_16px_rgba(74,139,48,.10)]"
        >
          <div
            class="w-12 h-12 rounded-full bg-pk-green-light border-2 border-[#A5D65A] flex items-center justify-center text-3xl flex-shrink-0"
          >
            {{ existingUser.gender === '男' ? '👦' : '👧' }}
          </div>
          <div>
            <p class="text-base font-bold text-pk-brown">{{ existingUser.name }}</p>
            <p class="text-xs text-pk-brown-2 mt-0.5">{{ existingUser.department }} · {{ existingUser.gender }}</p>
          </div>
          <div class="ml-auto text-2xl">🌱</div>
        </div>
      </Transition>

      <!-- 主按鈕 -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150"
        leave-to-class="opacity-0"
      >
        <div v-if="!showForm" class="w-full flex flex-col gap-3 items-center">
          <button
            class="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full border-none text-base font-extrabold text-white bg-[linear-gradient(135deg,#7CC94E,#5A9E32)] shadow-pk-btn tracking-wide font-pk transition-transform duration-150 tap-transparent active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
            :disabled="!existingUser"
            @click="continuePlay"
          >
            <span>▶</span> 繼續遊玩
          </button>
          <button
            class="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full text-base font-extrabold text-pk-green-dark bg-white/[.82] border-2 border-[rgba(106,176,76,.4)] backdrop-blur-sm shadow-[0_4px_14px_rgba(0,0,0,.07)] tracking-wide font-pk transition-all duration-150 tap-transparent active:scale-95"
            @click="toggleNewStart"
          >
            <span>🌱</span> 新的開始
          </button>
          <p v-if="!existingUser" class="text-[0.78rem] text-[rgba(61,43,31,.45)]">尚無存檔，請選擇「新的開始」</p>
        </div>
      </Transition>

      <!-- 新的開始表單 -->
      <Transition
        enter-active-class="transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        enter-from-class="opacity-0 translate-y-7 scale-[.97]"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="showForm"
          class="w-full bg-white/[.97] rounded-[28px] px-5 pt-5 pb-6 shadow-[0_12px_48px_rgba(74,139,48,.15),_0_4px_12px_rgba(0,0,0,.07)] flex flex-col gap-[18px]"
        >
          <!-- 裝飾點 -->
          <div class="flex justify-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-pk-green-light" />
            <span class="w-1.5 h-1.5 rounded-full bg-[#A5D65A]" />
            <span class="w-1.5 h-1.5 rounded-full bg-pk-green-light" />
          </div>

          <button
            class="text-left text-sm font-bold text-pk-green tap-transparent font-pk bg-transparent border-none cursor-pointer"
            @click="toggleNewStart"
          >
            ‹ 返回
          </button>

          <h2 class="text-[1.1rem] font-extrabold text-pk-brown text-center -mt-2">建立你的角色</h2>

          <!-- 部門 -->
          <div class="flex flex-col gap-2">
            <label class="text-[0.8rem] font-bold text-pk-brown-2 flex items-center gap-1.5 font-pk">
              <span class="w-[7px] h-[7px] rounded-full bg-[linear-gradient(135deg,#7CC94E,#A5D65A)]" />
              你的部門
            </label>
            <div class="relative">
              <select
                v-model="form.department"
                class="w-full py-3 pl-3.5 pr-10 rounded-pk-sm border-2 border-pk-border bg-pk-cream text-[0.95rem] text-pk-brown font-pk appearance-none outline-none cursor-pointer focus:border-pk-green focus:bg-white transition-colors duration-150"
              >
                <option value="" disabled>請選擇部門…</option>
                <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
              </select>
              <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-pk-brown-light pointer-events-none">▾</span>
            </div>
          </div>

          <!-- 名字 -->
          <div class="flex flex-col gap-2">
            <label class="text-[0.8rem] font-bold text-pk-brown-2 flex items-center gap-1.5 font-pk">
              <span class="w-[7px] h-[7px] rounded-full bg-[linear-gradient(135deg,#7CC94E,#A5D65A)]" />
              你的名字
            </label>
            <input
              v-model="form.name"
              type="text"
              maxlength="20"
              placeholder="輸入你的暱稱…"
              class="w-full py-3 px-3.5 rounded-pk-sm border-2 border-pk-border bg-pk-cream text-[0.95rem] text-pk-brown font-pk outline-none placeholder:text-pk-brown-light focus:border-pk-green focus:bg-white transition-colors duration-150"
            />
          </div>

          <!-- 性別 -->
          <div class="flex flex-col gap-2">
            <label class="text-[0.8rem] font-bold text-pk-brown-2 flex items-center gap-1.5 font-pk">
              <span class="w-[7px] h-[7px] rounded-full bg-[linear-gradient(135deg,#7CC94E,#A5D65A)]" />
              性別
            </label>
            <div class="flex gap-2.5">
              <button
                v-for="g in genders"
                :key="g"
                type="button"
                class="flex-1 py-3 rounded-pk-sm border-2 text-[0.9rem] font-bold font-pk transition-all duration-150 tap-transparent active:scale-95 cursor-pointer"
                :class="
                  form.gender === g
                    ? 'border-pk-green bg-pk-green-light text-[#3D7A20]'
                    : 'border-pk-border bg-pk-cream text-pk-brown-2'
                "
                @click="form.gender = g"
              >
                {{ g === '男' ? '👦 男' : '👧 女' }}
              </button>
            </div>
          </div>

          <!-- 錯誤提示 -->
          <Transition
            enter-active-class="transition-opacity duration-200"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div
              v-if="formError"
              class="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#FFF3E0] border border-[#FFCC80] rounded-[12px] text-[0.82rem] text-[#8B4500] font-pk"
            >
              <span>🌿</span> {{ formError }}
            </div>
          </Transition>

          <!-- 開始活動 -->
          <button
            class="w-full flex items-center justify-center gap-2.5 py-4 rounded-[16px] border-none bg-[linear-gradient(135deg,#7CC94E,#5A9E32)] text-white text-[1.05rem] font-extrabold tracking-wide font-pk shadow-pk-btn transition-transform duration-150 tap-transparent active:scale-95 cursor-pointer"
            @click="startActivity"
          >
            <span>🚀</span> 開始活動！
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
  /* 雲朵形狀（需要 ::before/::after pseudo-elements） */
  .cloud {
    position: absolute;
    background: white;
    border-radius: 999px;
    opacity: 0.85;
  }
  .cloud::before,
  .cloud::after {
    content: '';
    position: absolute;
    background: white;
    border-radius: 50%;
  }
  .cloud--1 {
    width: 80px;
    height: 24px;
    top: 60px;
    right: 30px;
  }
  .cloud--1::before {
    width: 36px;
    height: 36px;
    top: -18px;
    left: 14px;
  }
  .cloud--1::after {
    width: 28px;
    height: 28px;
    top: -12px;
    left: 40px;
  }
  .cloud--2 {
    width: 60px;
    height: 18px;
    top: 110px;
    left: 20px;
    opacity: 0.7;
  }
  .cloud--2::before {
    width: 28px;
    height: 28px;
    top: -14px;
    left: 10px;
  }
  .cloud--2::after {
    width: 22px;
    height: 22px;
    top: -9px;
    left: 32px;
  }
  .cloud--3 {
    width: 50px;
    height: 16px;
    top: 40px;
    left: 50%;
    opacity: 0.6;
  }
  .cloud--3::before {
    width: 24px;
    height: 24px;
    top: -12px;
    left: 8px;
  }
  .cloud--3::after {
    width: 18px;
    height: 18px;
    top: -8px;
    left: 28px;
  }

  /* 浮動小花動畫 */
  .flower {
    animation: floatFlower 4s ease-in-out infinite;
  }
  .flower--1 {
    bottom: 60px;
    left: 18px;
    animation-delay: 0s;
  }
  .flower--2 {
    bottom: 40px;
    right: 28px;
    animation-delay: 1s;
  }
  .flower--3 {
    bottom: 80px;
    left: 42%;
    animation-delay: 2s;
  }
  .flower--4 {
    bottom: 55px;
    right: 54px;
    animation-delay: 0.5s;
  }
  @keyframes floatFlower {
    0%,
    100% {
      transform: translateY(0) rotate(-5deg);
    }
    50% {
      transform: translateY(-6px) rotate(5deg);
    }
  }
</style>
