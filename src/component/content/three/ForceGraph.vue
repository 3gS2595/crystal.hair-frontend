<template>
  <VueForceGraph3D
    class="fg"
    ref="fgRef"
    :graphData="JsonData"
    backgroundColor="black"
    linkOpacity="0.7"
    :showNavInfo=bool
    :linkWidth=lineWidth
    :onNodeDragEnd="
      (node) => {
        node.fx = node.x;
        node.fy = node.y;
        node.fz = node.z;
      }
    "
  ></VueForceGraph3D>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { VueForceGraph3D } from 'vue-force-graph';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
const color = ref("green")
const bool = false
const lineWidth = 2
const aplhaDecay = 228
const fgRef = ref();
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
    console.log('CHANGED')
      setData(props.propKernals)
  }
)

let nodeData = ""
let linkData = ""
let JsonData = ref()
let loaded = ref(false)
const setData = (propKernals) => {
  try {
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
          linkData = linkData + "{ \"source\": \"" + i.id + "\", \"target\": \"" + n + "\", \"color\":\"#c2c249f8\"}, "
        }
      }
    }
    linkData = linkData.substring(0, linkData.length - 2)
    linkData = linkData + "]}"

    nodeData = "{ \"nodes\": ["
    for (let i of props.propMixtapes) {
      if(mId.includes(i.id)){
        nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 20, \"color\":\"#aae574\"}, "
      }
    }
    for (let i of props.propKernals) {
      if (ids.includes(i.id)) {
        if(i.file_type === ".avif"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 1, \"color\":\"orange\"}, "
        } else if(i.file_type === "link"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 1, \"color\":\"pink\"}, "
        } else if(i.file_type === ".pdf"){
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 1, \"color\":\"white\"}, "
        } else {
          nodeData = nodeData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 1, \"color\":\"#aae574\"}, "
        }
      }
    }
    nodeData = nodeData.substring(0, nodeData.length - 2)
   
    console.log(nodeData + linkData)
    if (nodeData + linkData !== "{ \"nodes\":], \"links\": ]}") {
      JsonData = JSON.parse(nodeData + linkData)
    }
    console.log(JsonData)
    if (JsonData != null) {
      loaded = true
    }

    setTimeout (() => {
      fgRef.value.zoomToFit(76)
    }, 800)

  } catch (e) {
        console.error(e)
      }

}
onMounted(() => {
  const bloomPass = new UnrealBloomPass()
  bloomPass.strength = 0.2
  bloomPass.radius = 0.5
  bloomPass.threshold = 0.1
  fgRef.value.postProcessingComposer().addPass(bloomPass)
})

</script>
