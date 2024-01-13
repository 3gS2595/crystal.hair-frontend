<template>

  <DataView class="contentView" :value="kernals" layout="grid" >
    <template #grid="slotProps">
      <div class="cgb-0" v-on:click="toggleLightBox(slotProps.index)">

        <div class="cgb-0-txt" v-if="slotProps.data.file_type === '.txt'">
          <a class="text-content-0">{{ slotProps.data.description }}</a>
        </div>

        <vue-load-image v-else >
          <template v-slot:image>
            <img :id="`${slotProps.data.id}`" class="thumbnail" :src="`${setSize(slotProps.data)}`"/>
          </template>
          <template v-slot:preloader>
            <div class="loading"/>
          </template>
          <template v-slot:error>
            <div>*Image load error</div>
          </template>
        </vue-load-image>

        <div v-if="setInfo(slotProps.data) != ''" class="cgb-0-info">{{setInfo(slotProps.data)}}</div>

      </div>
    </template>
  </DataView>

</template>

<script setup lang="ts">
  import type { kernalType } from '@/assets/types/ApiTypes'

  import { ref, watch, onMounted } from 'vue'
  import DataView from 'primevue/dataview'

  import { storeToRefs } from 'pinia'
  import { useKernalStore } from '@/services/api/KernalStore'
  import { GlobalStore } from '@/services/GlobalStore'
  import VueLoadImage from 'vue-load-image'

  const { kernals, pageNumber } = storeToRefs(useKernalStore())
  const { cgbWidth } = storeToRefs(GlobalStore())
  const store = GlobalStore()
  const props = withDefaults(defineProps<{
    id: number
  }>(), {
    id:-1
  })
  watch(
    () => kernals.value,
    () => {
      if (kernals.value.length <= store.pageSize  ) {
        pageNumber.value = 2
      }
    }
  )
  watch(
    () => cgbWidth.value,
    () => {
      resize()
    }
  )

// LIGHTBOX TOGGLE
  const toggleLightBox = (ind: number) => {
    if (store.lightBoxIndex === -1) {
      store.setLightBoxView(!store.lightBoxView)
    }
    store.setLightBoxIndex(ind)
  }

// GENERATE CGB DESCRIPTION TEXT
  const setInfo = (k: kernalType) => {
    if (k.description != null) {
      if (k.description.length > 0) {
        return k.description
      }
    }
    if (k.url != null) {
      if (k.url.length > 0) {
        return k.url.replace('www.', '')
      }
    }
    return ''
  }

// SRCSET IMAGE SELECTION ACCORDING TO CARD SIZE
  const setSize = (k) => {
    const images = document.getElementsByClassName('cgb-0');
    if (images[0] !== undefined) {
      const width = images[0].offsetWidth
      if (width > 160 && width <= 400){
        return k.signed_url_m;
      } else if (width > 400 && width <= 1000){
        return k.signed_url_l;
      } else if (width > 1000) {
        return k.signed_url;
      } else {
        return k.signed_url_s;
      }
    }
  }
  const resize = () => {
    const images = document.getElementsByClassName('thumbnail');
    if (images[0] !== undefined && images[0].parentElement !== null) {
      const width = images[0].offsetWidth
      for(let i = 0; i < images.length; i++) {
        const f = kernals.value.findIndex(x => x.id === images[i].id)
        if (width > 160 && width <= 400){
          images[i].setAttribute('src', kernals.value[f].signed_url_m);
        } else if (width > 400 && width <= 1000){
          images[i].setAttribute('src', kernals.value[f].signed_url_l);
        } else if (width > 1000) {
          images[i].setAttribute('src', kernals.value[f].signed_url);
        } else {
          images[i].setAttribute('src', kernals.value[f].signed_url_s);
        }
      }
    }
  }

// INFINITE SCROLL METHODS
  const intersecting = (event) => {
    for (const e of event){
      if (e.isIntersecting && kernals.value[kernals.value.length - 1].signed_url != "page-loader.gif") {
        observer.disconnect()
        if(kernals.value.length >= store.pageSize) {
          useKernalStore().fetchKernals(pageNumber.value)
        }
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
