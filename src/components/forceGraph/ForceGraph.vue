<template>
  <VueForceGraph3D
    class="fg"
    ref="fgRef"
    :graphData="JsonData"
    :backgroundColor=bgColor
    :height=h
    :width=w
    :showNavInfo=false
    :linkOpacity= lineOpacity
    :nodeOpacity= nodeOpacity
    nodeLabel="name"
    :linkWidth=lineWidth
    :d3AlphaDecay= dec
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { VueForceGraph3D } from 'vue-force-graph';
import { ApiStore } from '@/services/ApiStore'
import { SessionStore } from '@/stores/SessionStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'

const store = GlobalStore()
const { mixtape } = storeToRefs(store)

const lineWidth = ref(1)
const lineOpacity = ref(0.7)
const nodeOpacity = ref(0.9)
const fgRef = ref();
const dec = ref(0.0228)
const h = 220
const w = 201
const props = withDefaults(defineProps<{
  forceGraph: any[],
  mixtapes: any[],
  connections_mix: any[],
}> (), {
  forceGraph: [],
  mixtapes: [],
  connections_mix: [],
})

const bgSet = () => {
  if(store.darkMode === false){
    nodeOpacity.value = 0.9
    lineOpacity.value = 0.7
    lineWidth.value = 3
    return "rgba(0,0,0,0)"
  } else {
    nodeOpacity.value = 0.9
    lineOpacity.value = 0.7
    lineWidth.value = 4
    return "#101010"
  }
}
const bgColor = ref(bgSet())
watch(() => store.darkMode,() => {
    bgColor.value = bgSet()
    setData()
})
watch(() => props.forceGraph,() => {
  setData()
})
watch(() => mixtape.value,() => {
  setData()
})

let JsonData = ref({ nodes: [], links: [] });
const setData = () => {
  try {
    let linkC = store.darkMode    ? "#a3ad99" : "#5c5266"
    let mixtapeC = store.darkMode ? "#3459b1" : "#cba64e"
    let imgC = store.darkMode     ? "#9ed9d3" : "#61262c"
    let pdfC = store.darkMode     ? "#8888b8" : "#777747"
    let siteC = store.darkMode    ? "#ffc0cb" : "#ffffff"
    let nodeC = store.darkMode    ? "#aae574" : "#ffffff"
    let ids = []
    let kId = []
    const mId = []

    if (Object.keys(props.forceGraph).length == 2) {
      JsonData = props.forceGraph
      JsonData = { nodes: props.forceGraph["nodes"], links: props.forceGraph["links"]}
      if(mixtape.value === '' && store.filter === '' && JsonData["links"].length > 100){
        dec.value = .1096
        fgRef.value.cameraPosition({ z:930, y:80, x:500},{ x:0, y:-50, z:0 }, 200)
      } else {
        dec.value = 0.0228
        setTimeout (() => {
          fgRef.value.zoomToFit(200, 0)
        }, 300)
      }
    }
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
   setData()
})
</script>
