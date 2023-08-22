<template>
  <div class="tableCard">
    <DataTable
      :value="props.contentData"
      resizableColumns="true"
      autoLayout="true"
      responsive="true"
      dataKey="id"
      scrollable scrollHeight="flex"
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
        v-for="(col, index) of selectedColumns"
        :key="col.field + '_' + index"
        :field="col.field"
        :header="col.header"
      >
        <template #body="slotProps" v-if="linktype">
          <a
            @click="search(slotProps.data.content)"
            v-text="slotProps.data[col.field]"
          />
        </template>
        <template #body="slotProps" v-else >
          <a
            :href="slotProps.data.url" target="_blank"
            v-text="slotProps.data[col.field]"
          />
        </template>

        </Column>
    </DataTable>
  </div>
</template>

<script setup lang='ts' generic="T">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import MultiSelect from 'primevue/multiselect'

import { ContentService } from '@/component/table/GetRss'
import { filterStore } from '../../store/FilterStore'

const props = withDefaults(defineProps<{
   interiorLink: array, 
   tableOrder: array ,
   contentData: array
 }>(), {
     interiorLink: [],
     tableOrder: [],
     contentData: []
 })


const linktype = (props.interiorLink.length > 0)

const columns = ref<array>()
const heads: string[] = []
for (let i = 0; i < props.tableOrder.length; i++) { heads[i] = props.tableOrder[i] } // eslint-disable-line
columns.value = ContentService.generateColumns([props.contentData, heads])
const selectedColumns = ref<string[]>(columns.value)
const onToggle = (val) => {
  selectedColumns.value = columns.value.filter(col => val.includes(col))
}

const search = (e) => {
  const store = new filterStore()
  store.setFilter('')
  if(store.mixtape === e) {
    store.setMixtape('')
    }else {
      store.setMixtape(e)
    }
  }
</script>
