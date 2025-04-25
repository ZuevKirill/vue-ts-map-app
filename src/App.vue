<template>
  <div class="container">
    
      <DeviceTree @deviceSelected="deviceId = $event"  v-if="showElement"/>
      <GeoZoneTree @zonesChanged="zones = $event" />

    <MapView :selectedDeviceId="deviceId" :selectedZones="zones" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { login } from './services/api'
import DeviceTree from './components/DeviceTree.vue'
import GeoZoneTree from './components/GeoZoneTree.vue'
import MapView from './components/MapView.vue'

const deviceId = ref<number>();
const zones = ref<number[]>([]);
const showElement = ref(false);

onMounted(async () => {
  await login();
  setTimeout(() => {
    showElement.value = true
  }, 500)
})
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
}
.row{
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 20px;
}
</style>
