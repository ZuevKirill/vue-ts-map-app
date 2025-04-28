<template>
    <ul class="ul">
        <li v-if="data">
        <label>
            <input
            :type="data.type === 'device' ? inputType : 'hidden'"
            :name="inputType"
            :checked="isChecked"
            @change="onChangeHandler"
            />
            {{ data.Name }}
        </label>
        <ul v-if="data.children?.length">
            <DeviceItem
            v-for="child in data.children"
            :key="child.ID"
            :data="child"
            :input-type="inputType"
            :selected-id="selectedId"
            :selected-ids="selectedIds"
            :on-change="onChange"
            />
        </ul>
        </li>
    </ul>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  defineOptions({ name: 'DeviceItem' })
  const props = defineProps({
    data: Object,
    inputType: String,
    selectedId: [String],
    selectedIds: [String],
    onChange: Function,
  })
  
  const isChecked = computed(() => {
    if (!props.device) return false;
    return props.selectedIds.includes(props.data.ID)
  })
  
  function onChangeHandler(event) {
    const payload = { id: props.data.ID, checked: event.target.checked }
    props.onChange?.(payload)
  }
  </script>
  <style scoped lang="scss">
  ul {
    list-style-type: none;
    padding: 0;
  }

  ul ul {
    padding-left: 10px;
  }
</style>