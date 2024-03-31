<template>
  <VueForceGraph3D
    class="fg"
    ref="fgRef"
    :graphData="JsonData"
    :backgroundColor=bgColor
    height=220
    width=201
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
import { VueForceGraph3D } from 'vue-force-graph';
import { storeToRefs } from 'pinia'
import { ApiStore } from '@/services/ApiStore'
import { SessionStore } from '@/stores/SessionStore'
import { GlobalStore } from '@/stores/GlobalStore'
import { useMixtapeStore } from '@/stores/api/MixtapeStore'
import { useForceGraphStore } from '@/stores/api/ForceGraphStore'
import { useConnectionsStore } from '@/stores/api/connectionsStore'

const store = GlobalStore()

const lineWidth = ref(1)
const lineOpacity = ref(0.7)
const nodeOpacity = ref(0.9)
const fgRef = ref();
const dec = ref(0.0228)

const props = withDefaults(defineProps<{
  forceGraph: any[],
  mixtapes: any[],
  connections_mix: any[],
  mixtape: String
}> (), {
  forceGraph: [],
  mixtapes: [],
  connections_mix: [],
  mixtape: ''
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
    return "#242424"
  }
}
const bgColor = ref(bgSet())
watch(
  () => store.darkMode,
  () => {
    bgColor.value = bgSet()
    setData()
  }
)
watch(
  () => props.forceGraph,
  () => { setData() }
)
watch(
  () => props.mixtape,
  () => { setData() }
)

let nodeData = ""
let linkData = ""
let JsonData = ref({ nodes: [], links: [] });
const newLink = (id: string, target: string, color:string) => {
  return {
    source: id,
    target: target,
    color: color
  }
}
const newNode = (id:string, name:string, val:string, color:string) => {
  return {
    id: id,
    name: name,
    val: val,
    color: color
  }
}
const setData = () => {
  try {
    let linkC = store.darkMode    ? "#a3ad99" : "#5c5266"
    let mixtapeC = store.darkMode ? "#3459b1" : "#cba64e"
    let imgC = store.darkMode     ? "#9ed9d3" : "#61262c"
    let pdfC = store.darkMode     ? "#8888b8" : "#777747"
    let siteC = store.darkMode    ? "#ffc0cb" : "#ffffff"
    let nodeC = store.darkMode    ? "#aae574" : "#ffffff"
    const ids = []
    let kId = []
    const mId = []

    if (props.mixtape !== '') {
      const mix = props.mixtapes.find(mix => mix.id === props.mixtape)
      const curK = props.connections_mix.find(i => i.id === mix.content_id).contains
      for (let i of props.forceGraph) {
        if (curK.includes(i.id)) kId.push(i.id)
      }
    } else {
      for (let i of props.forceGraph) {
        kId.push(i.id)
      }
    }

    linkData = []
    for (let i of props.mixtapes) {
      for (let n of props.connections_mix.find(mix => mix.id === i.content_id).contains) {
        if (kId.includes(n)){
          if (!mId.includes(i.id)) mId.push(i.id)
          ids.push(n)
          linkData.push(newLink(i.id, n, linkC))
        }
      }
    }

    nodeData = []
    for (let i of props.mixtapes) {
      if(mId.includes(i.id)){
        nodeData.push(newNode(i.id, i.name, '8', mixtapeC))
      }
    }
    for (let i of props.forceGraph) {
      if (ids.includes(i.id)) {
        if(i.file_type === ".avif"){
          nodeData.push(newNode(i.id, i.id, '2', imgC))
        } else if(i.file_type === "link"){
          nodeData.push(newNode(i.id, i.id, '2', siteC))
        } else if(i.file_type === ".pdf"){
          nodeData.push(newNode(i.id, i.id, '2', pdfC))
        } else {
          nodeData.push(newNode(i.id, i.id, '2', nodeC))
        }
      }
    }

    JsonData = { nodes: nodeData, links: linkData}
    if(props.mixtape === '' && store.filter === '' && linkData.length > 100){
      dec.value = .1096
      fgRef.value.cameraPosition({ z:930, y:80, x:500},{ x:0, y:-50, z:0 }, 200)
    } else {
      dec.value = 0.0228
      setTimeout (() => {
        fgRef.value.zoomToFit(200, 0)
      }, 300)
    }
  } catch (e) {
    console.error(e)
  }
}
onMounted(() => {
   setData(props.forceGraph)
})
</script>
