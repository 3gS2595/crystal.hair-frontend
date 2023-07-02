<template>
        <DataTable
          v-model:filters="filters" :value="content"
          resizableColumns columnResizeMode="expand"
          paginator :rows="size"
          dataKey="id"
          filterDisplay="row" :loading="loading" :globalFilterFields="['date', 'title', 'url', 'site', 'name', 'count', 'urls']"
        >

            <template #header>
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText
                          v-model="filters['global'].value" placeholder="searchQuery"
                        />
                    </span>
                </div>
            </template>

            <template #empty>empty placeholder</template>
            <template #loading>Loading data. Please wait.</template>

            <Column
              v-for="col of columns"
              :key="col.field"
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
                  v-model="filterModel.value"
                  type="text" @input="filterCallback()"
                  class="p-column-filter"
                  placeholder="searchQuery"
                />
              </template>
            </Column>
          </DataTable>
</template>

<script setup generic="T">
import { ref, onMounted, watch, defineProps } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

import { useCounterStore } from '../store/GlobalStore'
import { ContentService } from '@/table/GetRss'

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
console.log(props.size)
var size = props.size // eslint-disable-line
const loading = ref(true)
const store = useCounterStore()
const content = ref()
const columns = ref()
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
  ContentService.getContent(props.apiAccess[0]).then((data) => {
    content.value = data
    var heads = []
    for (let i = 1; i < props.apiAccess.length; i++) { heads[i] = props.apiAccess[i] }
    columns.value = ContentService.generateColumns([data, heads])
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
