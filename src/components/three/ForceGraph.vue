<template>
  <VueForceGraph3D
    class="fg"
    ref="fgRef"
    :graphData="JsonData"
    :backgroundColor=bgColor
    height=145
    width=201
    :showNavInfo=bool
    :linkOpacity= lineOpacity
    :nodeOpacity= nodeOpacity
    nodeLabel="name"
    :linkWidth=lineWidth
    :d3AlphaDecay= dec
  ></VueForceGraph3D>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { VueForceGraph3D } from 'vue-force-graph';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { GlobalStore } from '@/store/GlobalStore'
const store = GlobalStore()

const color = ref("green")
const bool = false
const lineWidth = ref(1)
const lineOpacity = ref(0.7)
const nodeOpacity = ref(0.9)
const fgRef = ref();
const dec = ref(0.0228)
const props = withDefaults(defineProps<{
  propKernals: any[],
  propMixtapes: any[]
}> (), {
  propKernals: [],
  propMixtapes: []
})
watch(
  () => props.propKernals,
  () => {
    setData(props.propKernals)
  }
)

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
watch(
  () => store.darkMode,
  () => {
    bgColor.value = bgSet()
    setData(props.propKernals)
  }
)


let nodeData = ""
let linkData = ""
let JsonData = ref()
let loaded = ref(false)
const setData = (propKernals) => {
  try {
    let linkC = "#a3ad99"
    let mixtapeC = "#3459b1"
    let imgC = "#9ed9d3"
    let pdfC = "#8888b8"
    let siteC = "pink"
    let nodeC = "#aae574"

    if (store.darkMode === false) {
      linkC = "#5c5266"
      mixtapeC = "#cba64e"
      imgC = "#61262c"
      pdfC = "#777747"
      siteC = "#ffffff"
      nodeC = "#ffffff"
    }
    const ids = []
    const kId = []
    const mId = []
    for (let i of props.propKernals) {
      kId.push(i.id)
    }

    linkData = "], \"links\": [ "
    for (let i of props.propMixtapes) {
      for (let n of i.content) {
        if (kId.includes(n)){
          ids.push(n)
          if (!mId.includes(i.id)){
            mId.push(i.id)
          }
          linkData = linkData + "{ \"source\": \"" + i.id + "\", \"target\": \"" + n + "\", \"color\":\"" + linkC + "\"}, "
        }
      }
    }
    linkData = linkData.substring(0, linkData.length - 2)
    linkData = linkData + "]}"

    nodeData = "{ \"nodes\": ["
    for (let i of props.propMixtapes) {
      if(mId.includes(i.id)){
        nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.name + "\", \"val\": 8, \"color\":\"" + mixtapeC + "\"}, "
      }
    }
    for (let i of props.propKernals) {
      if (ids.includes(i.id)) {
        if(i.file_type === ".avif"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 2, \"color\":\"" + imgC + "\"}, "
        } else if(i.file_type === "link"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 2, \"color\":\"" + siteC + "\"}, "
        } else if(i.file_type === ".pdf"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 2, \"color\":\"" + pdfC + "\"}, "
        } else {
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 2, \"color\":\"" + nodeC + "\"}, "
        }
      }
    }
    nodeData = nodeData.substring(0, nodeData.length - 2)
    if (nodeData + linkData !== "{ \"nodes\":], \"links\": ]}") {
      JsonData = JSON.parse(nodeData + linkData)
    }
    if (JsonData != null) {
      loaded = true
    }
    if(store.mixtape === ''){
      dec.value = .1096
      fgRef.value.cameraPosition({ z:930, y:80, x:500},{ x:0, y:-50, z:0 }, 200)
    } else {
      dec.value = 0.0228
      setTimeout (() => {
        fgRef.value.zoomToFit(200, 1)
      }, 800)
    }
  } catch (e) {
    console.error(e)
  }
}


onMounted(() => {
   setData(props.propKernals)
})

</script>
