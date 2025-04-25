
<template>
  <div style="position: absolute; padding-inline: 16px; height: 100%; overflow-y: scroll; z-index: 1000; background: rgba(255, 255, 255, .6);">
    <h3>Транспорт</h3>
      <TreeItem
          v-for="device in devices"
          :key="device.ID"
          :data="device"
          :input-type="'radio'"
          :selected-id="selectedId"
          :selected-ids="selectedIds"
          :on-change="selectDevice"
        />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from 'vue'
import { getDevices } from '@/services/api'
import { buildTree } from '@/helpers/buildTree'
import TreeItem from './TreeItem.vue'

const emit = defineEmits(['deviceSelected']);
const devices = ref<any[]>([]);

onMounted(async () => {
  const { Groups, Items } = await getDevices();
  devices.value = buildTree(Groups, Items);
})

function selectDevice({ id }) {
  emit('deviceSelected', id);
}
</script>
