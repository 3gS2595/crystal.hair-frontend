<template>

  <div class ='lightbox' v-if='store.lightBoxView'>
      <vue-resizable
        class="resizable"
        ref="resizableComponent"
        :dragSelector="dragSelector"
        :active="handlers"
        :fit-parent="fit"
        :max-width="maxW | checkEmpty"
        :max-height="maxH | checkEmpty"
        :width="width"
        :height="height"
        :left="left"
        :top="top"
        @mount="eHandler"
        @resize:move="eHandler"
        @resize:start="eHandler"
        @resize:end="eHandler"
        @drag:move="eHandler"
        @drag:start="eHandler"
        @drag:end="eHandler"
      >
        <div class="block">
          <div class="drag-container-1">
          drag_1
           <a
        style="border:none; background-color:rgba(0, 0, 0, 0.0); padding:0px; margin:0px;"
        @click="close"
        >cookies</a>
</div>
            <img :src="`https://crystal-hair.nyc3.cdn.digitaloceanspaces.com/${props.viewerData[store.lightBoxIndex].file_path}`"/>
          <div class="drag-container-2">drag_2</div>
        </div>
      </vue-resizable>
      </div>
      <div v-else>
      </div>
</template>

<script setup>
import VueResizable from "vue-resizable";
import VueLoadImage from 'vue-load-image'
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
const props = defineProps({
  viewerData: {
    type: Array,
    default: () => [],
    required: true
  }
})
</script>

<script>
import { filterStore } from '@/store/FilterStore'

const store = filterStore()
export default {
  name: "App",
  components: { VueResizable },
  data() {
    let tW = window.innerWidth - 100;
    let tH = window.innerHeight - 100;
    return {
      handlers: ["r", "rb", "b", "lb", "l", "lt", "t", "rt"],
      left: 50,
      top: 50,
      height: tH,
      width: tW,
      maxW: window.innerWidth, 
      maxH: window.innerHeight,
      fit: true,
      event: "",
      dragSelector: ".drag-container-1, .drag-container-2",
      index:9
    };
  },
  methods: {
    eHandler(data) {
      this.width = data.width;
      this.height = data.height;
      this.left = data.left;
      this.top = data.top;
      this.event = data.eventName;
     this.maxW = window.innerWidth;
      this.maxH = window.innerHeight;

    },
    close() {
      store.setLightBoxView(false)
      store.setLightBoxIndex(-1)
    }
  },
  filters: {
    checkEmpty(value) {
      return typeof value !== "number" ? 0 : value;
    }
  }
}

</script>
