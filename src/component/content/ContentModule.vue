<template>
  <div class="contentView">
    <DataView :value="props.contentData" :layout="layout" scrollable scrollHeight="500px" :columns="4" >
      <template #header>
        <div class="flex justify-content-start">
          <DataViewLayoutOptions v-model="layout" />
        </div>
      </template>

      <template #list="slotProps">
        <div class="col-12">
          <div
            class="flex flex-column xl:flex-column  xl:align-items-end p-4 gap-4"
          >
            <img
              class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
              :src="`http://192.168.1.180:8080/img/${slotProps.data.path}`"
              :alt="slotProps.data.name"
            />
            <div
              class="test-6 flex flex-column sm:flex-row justify-content-left align-items-left xl:align-items-start flex-1 gap-4"
            >
              <div
                class="flex flex-column align-items-left sm:align-items-start gap-3"
              >
                <div >
                  {{ slotProps.data.id }}
                </div>
                <Rating
                  :modelValue="slotProps.data.rating"
                  readonly
                  :cancel="false"
                ></Rating>
                <div class="flex align-items-left gap-3">
                  <span class="flex align-items-left gap-2">
                    <i class="pi pi-tag"></i>
                    <span >{{
                      slotProps.data.path
                    }}</span>
                  <span>${{ slotProps.data.created_at }}</span>

                  </span>
                </div>
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
              <div class="flex align-items-left gap-2">
                <i class="pi pi-tag"></i>
                <span>{{ slotProps.data.category }}</span>
              </div>

            </div>
            <div class="flex flex-column align-items-left gap-3 py-5">
              <img
                class="w-9 "
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
                >${{ slotProps.data.created_at}}</span
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
const layout = ref('grid')

</script>
