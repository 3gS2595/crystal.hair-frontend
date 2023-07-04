<template>
  <div class="card">
    <DataTable
      removableSort
      tableStyle="min-width: 5rem"
      sortField="count" :sortOrder="-1"
      v-model:filters="filters" :value="content"
      resizableColumns
      paginator :rows="size"
      dataKey="id"
      filterDisplay="row" :loading="loading"
      :globalFilterFields="['date', 'title', 'url', 'site', 'name', 'count', 'urls']"
    >

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

      <template #empty>empty placeholder</template>
      <template #loading>Loading data. Please wait.</template>

      <Column
        style="width: 20px!important;"
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

<script setup generic="T">
import { ref, onMounted, watch, defineProps } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'
import { useCounterStore } from '../store/GlobalStore'
import { ContentService } from '@/table/GetRss'

import { ApiStore } from '../store/ApiStore'
const props = defineProps({
  apiAccess: {
    type: Array,
    default: () => []
  },
  size: {
    type: Number,
    default: 30
  }
})
var size = props.size // eslint-disable-line
const loading = ref(true)
const store = useCounterStore()
const content = ref()
const columns = ref()
const selectedColumns = ref(columns.value)
const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col))
}

const tester = 30
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  url: { value: null, matchMode: FilterMatchMode.CONTAINS },
  urls: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  count: { value: null, matchMode: FilterMatchMode.CONTAINS },
  site: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

onMounted(() => {
  const apiStore = ApiStore()
  const userToken = apiStore.apiFetch(props.apiAccess[0])
  userToken.then(function (data) {
    content.value = data
    const heads = []
    for (let i = 1; i < props.apiAccess.length; i++) { heads[i] = props.apiAccess[i] }
    columns.value = ContentService.generateColumns([data, heads])[0]
    selectedColumns.value = ContentService.generateColumns([data, heads])[1]
    loading.value = false
  })
})

watch(
  () => store.filter,
  () => {
    console.log('store.filter=' + store.filter)
    filters.value.global.value = store.filter
  }
)

watch(
  () => filters.value.global.value,
  () => {
    if ((store.filter !== filters.value.global.value)) {
      console.log('store.filter=' + store.filter)
      store.setFilter(filters.value.global.value)
    }
  }
)
</script>
