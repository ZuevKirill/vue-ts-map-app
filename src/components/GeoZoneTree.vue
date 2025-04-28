
<template>
  <div style="position: absolute; padding-inline: 16px; height: 100%; overflow-y: scroll; z-index: 1000; background: rgba(255, 255, 255, .6); right: 0;">
    <h3>Геозоны</h3>
        <div v-if="error">failed to load the article</div>
      <div v-else-if="!zones">loading...</div>
      <TreeItem
          v-if="zones"
          v-for="zone in zones"
          :key="zone.ID"
          :data="zone"
          :input-type="'checkbox'"
          :selected-id="selectedId"
          :selected-ids="selectedIds"
          :on-change="toggleZone"
        />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getGeofences  } from '@/services/api';
import { buildTree } from '@/helpers/buildTree';
import TreeItem from './TreeItem.vue';


type TreeNode = {
  key: string;
  label: string;
  children?: TreeNode[];
};

const emit = defineEmits(['zonesChanged'])
const zones = ref<any[]>([])
const selected = ref<number[]>([])

onMounted(async () => {
  const {Groups, Items} = await getGeofences();
  zones.value = buildTree(Groups, Items);
});

function toggleZone({id, checked}: any) {
  if (checked) {
    selected.value.push(id);
  } else {
    selected.value = selected.value.filter(z => z !== id);
  }
  emit('zonesChanged', [...selected.value]);
}
</script>

