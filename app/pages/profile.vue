<script setup lang="ts">
useHead({ title: '帳號' })

interface UserProfile { department: string; name: string; gender: string }
const user = ref<UserProfile | null>(null)
onMounted(() => {
  const stored = localStorage.getItem('user_profile')
  if (stored) { try { user.value = JSON.parse(stored) } catch {} }
})

const firstChar = computed(() => user.value?.name?.charAt(0) ?? '？')

function clearAndRelogin() {
  localStorage.removeItem('user_profile')
  navigateTo('/login')
}
</script>

<template>
  <div class="flex flex-col gap-5 px-4 pt-5 font-pk">

    <!-- 頁首 -->
    <div class="flex flex-col gap-1 pb-1">
      <span class="inline-flex items-center gap-1.5 bg-pk-green-light text-pk-green-dark
                   text-[0.75rem] font-bold px-3 py-[5px] rounded-full w-fit">
        <span>🌱</span> 我的帳號
      </span>
      <h1 class="text-[1.7rem] font-black text-pk-brown leading-tight">我的帳號</h1>
    </div>

    <!-- 個人資料卡 -->
    <div class="bg-white rounded-[28px] flex flex-col items-center gap-6 pt-8 pb-5 px-5
                shadow-pk-card-lg border border-pk-border">

      <!-- 圓形首字元頭像 -->
      <div class="w-[88px] h-[88px] rounded-full flex items-center justify-center
                  text-[2.4rem] font-black text-white leading-none
                  bg-[linear-gradient(135deg,#A5D65A,#5A9E32)]
                  shadow-pk-avatar flex-shrink-0">
        {{ firstChar }}
      </div>

      <!-- 資訊列表 -->
      <div class="w-full bg-pk-cream rounded-[18px] border border-pk-border overflow-hidden">
        <div class="flex items-center gap-3 px-[18px] py-[15px]">
          <span class="text-[1.1rem] w-6 text-center flex-shrink-0">👤</span>
          <span class="text-[0.82rem] font-bold text-pk-brown-2 w-10 flex-shrink-0">名稱</span>
          <span class="flex-1 text-[0.95rem] font-extrabold text-pk-brown text-right">{{ user?.name ?? '—' }}</span>
        </div>
        <div class="h-px bg-pk-border mx-[18px]" />
        <div class="flex items-center gap-3 px-[18px] py-[15px]">
          <span class="text-[1.1rem] w-6 text-center flex-shrink-0">🏢</span>
          <span class="text-[0.82rem] font-bold text-pk-brown-2 w-10 flex-shrink-0">部門</span>
          <span class="flex-1 text-[0.95rem] font-extrabold text-pk-brown text-right">{{ user?.department ?? '—' }}</span>
        </div>
        <div class="h-px bg-pk-border mx-[18px]" />
        <div class="flex items-center gap-3 px-[18px] py-[15px]">
          <span class="text-[1.1rem] w-6 text-center flex-shrink-0">
            {{ user?.gender === '男' ? '👦' : '👧' }}
          </span>
          <span class="text-[0.82rem] font-bold text-pk-brown-2 w-10 flex-shrink-0">性別</span>
          <span class="flex-1 text-[0.95rem] font-extrabold text-pk-brown text-right">{{ user?.gender ?? '—' }}</span>
        </div>
      </div>

      <!-- 清除並重新登入 -->
      <button class="w-full flex items-center justify-center gap-2
                     py-3.5 rounded-full border-2 border-[#FFCCBC] bg-white
                     text-[0.95rem] font-extrabold text-[#C0603A]
                     font-pk shadow-[0_2px_10px_rgba(192,96,58,.08)]
                     transition-all duration-150 tap-transparent active:scale-[.97] cursor-pointer
                     hover:bg-[#FFF3EE]"
              @click="clearAndRelogin">
        🚪 清除資料並重新登入
      </button>
    </div>
  </div>
</template>
