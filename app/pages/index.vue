<script setup lang="ts">
  useHead({
    title: '首頁',
    meta: [{ name: 'description', content: '查看活動地圖、追蹤你在三所校園的禱告與傳道足跡。' }]
  })

  import { onMounted, ref, computed } from 'vue'

  import imgElder from '~/assets/images/elder.png'
  import imgCampus from '~/assets/images/campus.png'
  import imgFamily from '~/assets/images/family.png'
  import imgGalaxy from '~/assets/images/galaxy.png'
  import imgSS from '~/assets/images/ss.png'
  import imgYouth from '~/assets/images/youth.png'
  import imgPastor from '~/assets/images/pastor.png'

  const deptImageMap: Record<string, string> = {
    長年部: imgElder,
    大學部: imgCampus,
    家庭局: imgFamily,
    銀河水: imgGalaxy,
    國高中部: imgSS,
    青年部: imgYouth,
    聖職者: imgPastor
  }

  interface UserProfile {
    department: string
    name: string
    gender: string
  }
  const user = ref<UserProfile | null>(null)
  const deptImage = computed(() => (user.value ? (deptImageMap[user.value.department] ?? null) : null))
  const deptLabel = computed(() => user.value?.department ?? '')

  const mapRef = ref<HTMLElement | null>(null)
  const statusMsg = ref('正在取得您的位置…')
  const locating = ref(true)

  onMounted(async () => {
    const stored = localStorage.getItem('user_profile')
    if (stored) {
      try {
        user.value = JSON.parse(stored)
      } catch {}
    }

    const L = await import('leaflet')
    const map = L.map(mapRef.value!).setView([25.033, 121.5654], 13)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map)

    if (!navigator.geolocation) {
      statusMsg.value = '瀏覽器不支援定位功能'
      locating.value = false
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.setView([latitude, longitude], 15)
        const icon = L.divIcon({
          html: '<div class="pulse-marker">📍</div>',
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        })
        L.marker([latitude, longitude], { icon }).addTo(map).bindPopup('<b>您在這裡！</b>').openPopup()
        statusMsg.value = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        locating.value = false
      },
      () => {
        statusMsg.value = '無法取得位置，顯示台北'
        locating.value = false
      }
    )
  })
</script>

<template>
  <div class="flex flex-col px-4 pt-5 font-pk">
    <!-- 地圖卡片 -->
    <section class="bg-white rounded-pk overflow-hidden shadow-pk-card border border-pk-border">
      <div class="flex items-center justify-between gap-2.5 px-4 py-3.5">
        <span
          class="inline-flex items-center gap-1.5 bg-pk-green-light text-pk-green-dark text-[0.78rem] font-bold px-3 py-[5px] rounded-full"
        >
          <span>📍</span> 我的位置
        </span>
        <div class="flex items-center gap-1.5 text-[0.72rem] text-pk-brown-2 max-w-40 text-right">
          <span
            v-if="locating"
            class="w-1.5 h-1.5 rounded-full bg-pk-green shrink-0 animate-[blink_1.2s_ease-in-out_infinite]"
          />
          {{ statusMsg }}
        </div>
      </div>
      <div ref="mapRef" class="w-full h-80" />
    </section>

    <!-- 部門圖片卡片 -->
    <section class="relative">
      <div class="wave-animation">
        <div class="circle-1"></div>
        <div class="circle-2"></div>
        <div class="circle-3"></div>
      </div>
      <!-- 有圖片 -->
      <div v-if="deptImage" class="relative flex justify-center items-center">
        <img :src="deptImage" :alt="deptLabel" class="w-full h-40 block dept-image-animation" :class="deptLabel === '家庭局' || deptLabel === '聖職者' ? 'object-contain' : 'object-cover'" />
      </div>

      <!-- 無圖片 Empty -->
      <div v-else class="flex flex-col items-center gap-2.5 px-6 py-10">
        <div class="text-[2.8rem] animate-[float_3s_ease-in-out_infinite]">🌱</div>
        <p class="text-[0.85rem] text-pk-brown-light">登入後將顯示您的部門圖片</p>
      </div>
    </section>
    <p class="text-sm text-pk-green-dark text-center"><span>✨</span> {{ deptLabel }}，出發囉！</p>
  </div>
</template>

<style>
  .pulse-marker {
    font-size: 28px;
    animation: pkPulse 1.8s ease-in-out infinite;
  }
  @keyframes pkPulse {
    0%,
    100% {
      transform: scale(1) translateY(0);
    }
    50% {
      transform: scale(1.25) translateY(-3px);
    }
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.2;
    }
  }
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  .dept-image-animation {
    animation: float 2s ease-in-out infinite;
  }

  .wave-animation {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
  }

  .wave-animation .circle-1,
  .wave-animation .circle-2,
  .wave-animation .circle-3 {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    background: rgba(62, 231, 62, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    animation: wave 5s ease-out infinite;
  }

  .wave-animation .circle-2 {
    animation-delay: 1s;
  }

  .wave-animation .circle-3 {
    animation-delay: 2s;
  }

  @keyframes wave {
    to {
      transform: translate(-50%, -50%) scale(10);
      opacity: 0;
    }
  }
</style>
