<template>
  <VueForceGraph3D
    ref="fgRef"
    :graphData="JsonData"
    nodeColor="green"
    backgroundColor="black"
    linkColor="white"
    linkOpacity="1.0"
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
import { GlobalStore } from '@/store/GlobalStore'
import { ApiStore } from '@/store/ApiStore'
import { VueForceGraph3D } from 'vue-force-graph';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const bool = false
const lineWidth = 2
const store = GlobalStore()
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
      setData(props.propKernals)
  }
)

let graphData = ""
let JsonData = ref()
let loaded = ref(false)
const setData = (propKernals) => {
  try {
    const ids = []
    
    graphData = "{ \"nodes\": ["
    for (let i of props.propMixtapes) {
      graphData = graphData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 20 }, "
      ids.push(i.id)
    }
    for (let i of props.propKernals) {
      graphData = graphData + "{ \"id\": \"" + i.id + "\", \"name\": \"" + i.id + "\", \"val\": 1 }, "
      ids.push(i.id)
    }
    graphData = graphData.substring(0, graphData.length - 2)
    
    graphData = graphData + "], \"links\": [ "
    for (let i of props.propMixtapes) {
      for (let n of i.content) {
        if (ids.includes(n)){
          console.log(ids.includes(n))
          graphData = graphData + "{ \"source\": \"" + i.id + "\", \"target\": \"" + n + "\" }, "
        }else {

          console.log(ids.includes(n))
        }
      }
    }
    graphData = graphData.substring(0, graphData.length - 2)
    graphData = graphData + "]}"

    JsonData = JSON.parse(graphData)
    console.log(JsonData)
    if (JsonData != null) {
      loaded = true
    }
  } catch (e) {
        console.error(e)
      }

}
onMounted(() => {
  const bloomPass = new UnrealBloomPass()
  bloomPass.strength = 1
  bloomPass.radius = 1
  bloomPass.threshold = 0.1
  fgRef.value.postProcessingComposer().addPass(bloomPass)
})

</script>
