<template>
  <div class="tableCard">
    <DataTable
      removableSort
      sortField="count" :sortOrder="-1"
      v-model:filters="filters" :value="content"
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

  source_url_id: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hypertext_id: { value: null, matchMode: FilterMatchMode.CONTAINS },

  updated_at: { value: null, matchMode: FilterMatchMode.CONTAINS },
  created_at: { value: null, matchMode: FilterMatchMode.CONTAINS },

  url: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  scrape_interval: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_last_scrape: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_initial_scrape: { value: null, matchMode: FilterMatchMode.CONTAINS },

  file_type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  file_path: { value: null, matchMode: FilterMatchMode.CONTAINS },
  size: { value: null, matchMode: FilterMatchMode.CONTAINS },
  author: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_posted: { value: null, matchMode: FilterMatchMode.CONTAINS },
  time_scraped: { value: null, matchMode: FilterMatchMode.CONTAINS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
  key_words: { value: null, matchMode: FilterMatchMode.CONTAINS },
  hashtags: { value: null, matchMode: FilterMatchMode.CONTAINS },
  likes: { value: null, matchMode: FilterMatchMode.CONTAINS },
  reposts: { value: null, matchMode: FilterMatchMode.CONTAINS },

  names: { value: null, matchMode: FilterMatchMode.CONTAINS },
  word_count: { value: null, matchMode: FilterMatchMode.CONTAINS },
  text_body: { value: null, matchMode: FilterMatchMode.CONTAINS },

  domain: { value: null, matchMode: FilterMatchMode.CONTAINS },
  tag_list: { value: null, matchMode: FilterMatchMode.CONTAINS },
  source: { value: null, matchMode: FilterMatchMode.CONTAINS },
  logo_path: { value: null, matchMode: FilterMatchMode.CONTAINS },
  post_date: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
