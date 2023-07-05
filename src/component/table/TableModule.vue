<template>
  <div class="tableCard">
    <DataTable
      removableSort
      sortField="count" :sortOrder="-1"
      v-model:filters="filters" :value="content"
      resizableColumns
      paginator :rows="size"
      dataKey="id"
      filterDisplay="row"
      :globalFilterFields="['date', 'title', 'url', 'site', 'name', 'count', 'urls', 'id']"
    >
      <template #empty>empty placeholder</template>

      <template #header>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value" placeholder="searchQuery"
            />
          </span>
          <MultiSelect
            :modelValue="selectedColumns"
            :options="columns"
            optionLabel="header"
            @update:modelValue="onToggle"
            display="chip"
            placeholder="Select Columns"
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
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            style="width:30px;"
            v-model="filterModel.value"
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
import { ref, setup, watch, defineProps } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'

import { useCounterStore } from '@/store/GlobalStore'
import { ContentService } from '@/component/table/GetRss'

const props = defineProps({
  tableOrder: {
    type: Array,
    default: () => [],
    validator: function (value: any) {
      return (
        ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
        -1
      )
    }
  },
  size: {
    type: Number,
    default: 30,
    validator: function (value: number) {
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

const store = useCounterStore()
const content = ref()
content.value = props.contentData // eslint-disable-line

const columns = ref()
const heads = []
for (let i = 0; i < props.tableOrder.length; i++) { heads[i] = props.tableOrder[i] } // eslint-disable-line
columns.value = ContentService.generateColumns([content.value, heads])
const selectedColumns = ref(columns.value)

const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col))
}

const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  url: { value: null, matchMode: FilterMatchMode.CONTAINS },
  urls: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  count: { value: null, matchMode: FilterMatchMode.CONTAINS },
  site: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
