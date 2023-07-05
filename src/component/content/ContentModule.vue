<template>
  <div class="card">
    <DataView :value="content" :layout="layout" paginator :rows="15">
      <template #header>
        <div class="flex justify-content-end">
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div
            class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4"
          >
            <img
              class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
              :src="`http://192.168.1.180:8080/img/${slotProps.data.path}`"
              :alt="slotProps.data.name"
            />
            <div
              class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4"
            >
              <div
                class="flex flex-column align-items-center sm:align-items-start gap-3"
              >
                <div class="text-2xl font-bold text-900">
                  {{ slotProps.data.id }}
                </div>
                <Rating
                  :modelValue="slotProps.data.rating"
                  readonly
                  :cancel="false"
                ></Rating>
                <div class="flex align-items-center gap-3">
                  <span class="flex align-items-center gap-2">
                    <i class="pi pi-tag"></i>
                    <span class="font-semibold">{{
                      slotProps.data.path
                    }}</span>
                  </span>
                  <Tag
                    :value="slotProps.data.inventoryStatus"
                    :severity="getSeverity(slotProps.data)"
                  ></Tag>
                </div>
              </div>
              <div
                class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"
              >
                <span class="text-2xl font-semibold"
                  >${{ slotProps.data.price }}</span
                >
                <Button
                  icon="pi pi-shopping-cart"
                  rounded
                  :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'"
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
          <div class="p-4 border-1 surface-border surface-card border-round">
            <div
              class="flex flex-wrap align-items-left justify-content-between gap-2"
            >
              <div class="flex align-items-center gap-2">
                <i class="pi pi-tag"></i>
                <span>{{ slotProps.data.category }}</span>
              </div>

            </div>
            <div class="flex flex-column align-items-left gap-3 py-5">
              <img
                class="w-9 shadow-2 border-round"
                :src="`http://192.168.1.180:8080/img/${slotProps.data.path}`"
                :alt="slotProps.data.name"
              />
              <div >{{ slotProps.data.path }}</div>
<!-- three main
              <Rating
                value="{product.rating}"
                readonly
                :cancel="false"
              ></Rating>
-->
            </div>
            <div class="flex align-items-left justify-content-between">
              <span class="text"
                >${{ slotProps.data.created_at
 }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
</template>
<style lang="css" scoped>
  @import 'primeflex/primeflex.css'
</style>
<script setup>
import { ref, onMounted } from 'vue'
import Rating from 'primevue/rating'
import Tag from 'primevue/tag'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'

const props = defineProps({
  size: {
    type: Number,
    default: 30,
    validator: function (value) {
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
const content = ref()
content.value = props.contentData // eslint-disable-line

const products = ref()
const layout = ref('grid')

const getSeverity = (product) => {
  switch (product.inventoryStatus) {
    case 'INSTOCK':
      return 'success'
    case 'LOWSTOCK':
      return 'warning'
    case 'OUTOFSTOCK':
      return 'danger'
    default:
      return null
  }
}
</script>
