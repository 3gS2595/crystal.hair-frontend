
<template>
    <div class="card">
        <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
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
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="date" header="date" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.date }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="title" filterField="title" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span>{{ data.title }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by country" />
                </template>
            </Column>
            <Column header="url" filterField="url" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span>{{ data.url }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by country" />
                </template>
            </Column>

          </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { FilterMatchMode, FilterService } from 'primevue/api'
import { CustomerService } from '@/table/GetRss'
import TriStateCheckbox from 'primevue/tristatecheckbox'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import MultiSelect from 'primevue/multiselect'
import Tag from 'primevue/tag'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import PrimeVue from 'primevue/config'
import { useCounterStore } from '../store/GlobalStore'

const store = useCounterStore()

const customers = ref()
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  url: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'])
const loading = ref(true)

onMounted(() => {
  CustomerService.getCustomers().then((data) => {
    customers.value = getCustomers(data)
    loading.value = false
  })
})
watch(
  () => store.filter,
  () => {
    console.log('download text has changed new value ' + store.filter)
    filters.value.global.value = store.filter
  })
const getCustomers = (data) => {
  console.log(data)
  return [...(data || [])].map((d) => {
    // d.date = new Date(d.date)
    return d
  })
}

</script>
