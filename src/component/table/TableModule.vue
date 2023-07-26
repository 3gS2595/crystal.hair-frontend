<template>
  <div class="tableCard">
    <DataTable
      removableSort
      sortField="count" :sortOrder="-1"
      v-model:filters="filters" :value="props.contentData"
      resizableColumns="true"
      autoLayout="true"
      responsive="true"
      dataKey="id"
      scrollable scrollHeight="flex"
      filterDisplay="row"
    >
      <template #empty>empty placeholder</template>

      <template #header>
        <div >
          <MultiSelect
            :modelValue="selectedColumns"
            :options="columns"
            optionLabel="header"
            @update:modelValue="onToggle"
            display="none"
            placeholdexr="Select"
          />
        </div>
      </template>

      <Column
        sortable
        v-for="(col, index) of selectedColumns"
        :key="col.field + '_' + index"
        :field="col.field"
        :header="col.header"
      >
        <template #body="slotProps">
          <a
            :href="slotProps.data.url" target="_blank"
            v-text="slotProps.data[col.field]"
          />
        </template>
        <template >
          <InputText
            style="width:30px;"
            type="text" @input="filterCallback()"
            class="p-column-filter"
            placeholder="searchQuery"
          />
        </template>
      </Column>

    </DataTable>
  </div>
</template>

<script setup lang='ts' generic="T">
import { ref, watch, defineProps } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'

import { useCounterStore } from '@/store/GlobalStore'
import { ContentService } from '@/component/table/GetRss'

const store = useCounterStore()
const props = defineProps({
  tableOrder: {
    type: Array,
    default: () => [],
    validator: function (value: string) {
      return (
        ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
        -1
      )
    }
  },
  contentData: {
    type: Array,
    default: () => [],
    required: true,
    validator: function (value) {
      return (
        ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
        -1
      )
    }
  }
})

const columns = ref()
const heads = []
for (let i = 0; i < props.tableOrder.length; i++) { heads[i] = props.tableOrder[i] } // eslint-disable-line
columns.value = ContentService.generateColumns([props.contentData, heads])
const selectedColumns = ref(columns.value)
const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col))
}

const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS }
  // source_url_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
watch(
  () => store.filter,
  () => {
    // console.log('store.filter=' + store.filter)
    filters.value.global.value = store.filter
  }
)
watch(
  () => filters.value.global.value,
  () => {
    if ((store.filter !== filters.value.global.value)) {
      store.setFilter(filters.value.global.value)
    }
  }
)
</script>
