<template>

  <DataView class="contentView" :value="props.contentData" layout="grid" >
    <template #grid="slotProps">
      <div class="cgb-0" v-on:click="toggleLightBox(slotProps.index)">

        <div class="cgb-0-txt" v-if="slotProps.data.file_type === '.txt'">
          <a>{{ slotProps.data.description }}</a>
        </div>

        <vue-load-image v-else >
          <template v-slot:image>
            <img :src="`${slotProps.data.signed_url_nail}`"/>
          </template>
          <template v-slot:preloader>
            <div class="loading"/>
          </template>
          <template v-slot:error>
            <div>*Image load error</div>
          </template>
        </vue-load-image>

        <div class="cgb-0-info">{{ slotProps.data.url }}</div>

      </div>
    </template>
  </DataView>

</template>

<script setup lang="ts">
  import type { kernalType } from '@/types/ApiTypes'

  import { ref, watch, onMounted } from 'vue'
  import DataView from 'primevue/dataview'

  import { ApiStore } from '@/store/ApiStore'
  import { GlobalStore } from '@/store/GlobalStore'
  import VueLoadImage from 'vue-load-image'

  const pageNumber = ref<number>(2)
  const store = GlobalStore()
  const props = withDefaults(defineProps<{
    contentData: PropType<kernalType[]>,
    id: number
  }>(), {
    contentData: [],
    id:-1
  })
  watch(
    () => props.contentData,
    () => {
      if (props.contentData.length < store.pageSize  ) {
        pageNumber.value = 2
      }
    }
  )

  const toggleLightBox = (ind: number) => {
    if (store.lightBoxIndex === -1) {
      store.setLightBoxView(!store.lightBoxView)
    }
    store.setLightBoxIndex(ind)
  }

  const fetchPage = async () => {
    observer.disconnect()
    ApiStore().fetchKernals(pageNumber.value)
    pageNumber.value = pageNumber.value + 1
  }

// INFINITE SCROLL METHODS
  const intersecting = (event) => {
    for (const e of event){
      if (e.isIntersecting) {
        observer.disconnect()
        fetchPage()
      }
    }
  }

  const watchIntersect = () =>{
    observer.disconnect()
    for (let i = 1; i < 5; i++) {
      const el = document.getElementsByClassName("cgb-0")[(pageNumber.value - 1) * store.pageSize - (5 * i)]
      if (el){
        observer.observe(el)
      }
    }
  }

  const config = {root: document.getElementsByClassName("p-grid")[props.id], threshold: 0.5}
  const observer = new IntersectionObserver(intersecting, config);
  onMounted(() => {
    const targetNode = document.getElementsByClassName("p-grid")[props.id]
    if (typeof(targetNode) == "object"){
      new MutationObserver(watchIntersect).observe(targetNode, {
        childList: true
      })
    }
  })
</script>
