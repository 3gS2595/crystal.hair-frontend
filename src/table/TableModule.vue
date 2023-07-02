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
import { ref, onMounted, computed, watch, defineProps, toRefs } from 'vue'
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

const container = ref()
const title = ref()

const props = defineProps({
  data: String
})
const { data } = toRefs(props)
const store = useCounterStore()
const customers = ref()
const columns = ref()
const filters = ref({
  global: { value: store.filter, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.CONTAINS },
  url: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
  updated_at: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'])
const loading = ref(true)

onMounted(() => {
  CustomerService.getCustomers().then((data) => {
    customers.value = getCustomers(data)
    columns.value = CustomerService.getColumns(data)
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
const getCustomers = (data) => {
  console.log(data)
  return [...(data || [])].map((d) => {
    // d.date = new Date(d.date)
    return d
  })
}

</script>
