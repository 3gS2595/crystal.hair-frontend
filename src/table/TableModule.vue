<template>
    <div class="card">
        <DataTable v-model:filters="filters" :value="content" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
                :globalFilterFields="['date', 'title', 'url']">
            <template #header>
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>
            <template #empty> empty placeholder </template>
            <template #loading> Loading data. Please wait. </template>
            <Column
              v-for="col of columns"
              :key="col.field"
              :field="col.field"
              :header="col.header"
            >
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
          </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { FilterMatchMode } from 'primevue/api'
import { ContentService } from '@/table/GetRss'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { useCounterStore } from '../store/GlobalStore'

const container = ref()
const store = useCounterStore()
const content = ref()
const columns = ref()
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  url: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const loading = ref(true)

onMounted(() => {
  ContentService.getContent().then((data) => {
    content.value = data
    columns.value = ContentService.getColumns(data)
    loading.value = false
  })
})
watch(
  () => store.filter,
  () => {
    console.log('globalFilter: ' + store.filter)
    filters.value.global.value = store.filter
  })
watch(
  () => filters.value.global.value,
  () => {
    if ((store.filter !== filters.value.global.value)) {
      console.log('globalFilter: ' + store.filter)
      store.setFilter(filters.value.global.value)
    }
  })

</script>
