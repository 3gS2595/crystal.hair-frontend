
<template>
    <div class="card">
        <DataTable v-model:filters="filters" :value="customers" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
                :globalFilterFields="['name', 'country.name', 'representative.name', 'status']">
            <template #header>
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </span>
                </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Loading customers data. Please wait. </template>
            <Column field="name" header="Name" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Country" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by country" />
                </template>
            </Column>
            <Column field="status" header="Status" :showFilterMenu="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #filter="{ filterModel, filterCallback }">
                    <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses" placeholder="Select One" class="p-column-filter" style="min-width: 12rem" :showClear="true">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option" :severity="getSeverity(slotProps.option)" />
                        </template>
                    </Dropdown>
                </template>
            </Column>
          </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { FilterMatchMode, FilterService } from 'primevue/api'
import { CustomerService } from '@/table/CustomerService'
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
FilterService.filters.contains(store.filter, 'Vue')
console.log(store.filter)
const customers = ref()
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  representative: { value: null, matchMode: FilterMatchMode.IN },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
  verified: { value: null, matchMode: FilterMatchMode.EQUALS }
})

const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'])
const loading = ref(true)

onMounted(() => {
  CustomerService.getCustomersMedium().then((data) => {
    customers.value = getCustomers(data)
    loading.value = false
  })
})

const getCustomers = (data) => {
  return [...(data || [])].map((d) => {
    d.date = new Date(d.date)

    return d
  })
}

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
</script>
