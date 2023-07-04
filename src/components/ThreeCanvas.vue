<template >
<Suspense>
   <template #default>
      <canvas ref='webGl' class='webGl' />   </template>
   <template #fallback>
     <a>Loading...</a>
   </template>
 </Suspense>
</template>

<script lang='ts'>
import {
  Scene,
  Mesh,
  PointLight,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader
} from 'three'
import * as THREE from 'three'
import { watch, onMounted, ref, defineProps, computed } from 'vue'
import { useCounterStore } from '../store/GlobalStore'
import { InteractionManager } from 'three.interactive'
import { useWindowSize } from '@vueuse/core'
const wratio = 1
const hratio = 1

let interactionManager: InteractionManager

export default {
  props: {
    imageData: {
      type: Array,
      default: () => []
    }
  },
  setup (props: any) {
    const manager = new THREE.LoadingManager()
    const loaderJPG = new THREE.TextureLoader(manager)
    const store = useCounterStore()
    const webGl = ref()
    let renderer: WebGLRenderer
    let camera: PerspectiveCamera
    let scene: Scene
    let mesh: Mesh
    let light: PointLight
    const forms: Mesh[] = []
    // const { width, height } = useWindowSize()
    const width = ref()
    const height = ref()
    width.value = 700
    height.value = 110
    const aspectRatio = computed(() => {
      return (width.value * wratio) / (height.value * hratio)
    })

    const gridx = -38
    const gridy = 0
    const gridxI = 10.85 // x axis iterative distance    let camera: PerspectiveCamera

    const setCanvas = () => {
      const canvas = webGl.value

      // Create Scene
      scene = new Scene()

      // Camera
      camera = new PerspectiveCamera(9, aspectRatio.value, 10, 80)
      camera.position.z = 63
      scene.add(camera)

      // Lights
      light = new PointLight(0xfffeff, 1.8)
      light.position.set(50, 50, 50)
      scene.add(light)

      // Renderer
      renderer = new WebGLRenderer({ canvas, alpha: true })
      renderer.setSize((width.value * wratio), (height.value * hratio))
      renderer.render(scene, camera)

      // Interaction Manager
      interactionManager = new InteractionManager(renderer, camera, renderer.domElement)

      // Creates post-api reception
      const apij = ref()

      const res = props.imageData
      apij.value = res

      if (apij.value !== undefined) {
        for (let i = 0; i < apij.value.length; i++) {
          const obj = JSON.parse(JSON.stringify(apij.value[i]))
          const path = ('/img/' + JSON.stringify(obj.path)).replace('"', '').replace('"', '')
          const pathClick = (JSON.stringify(obj.title)).replace('"', '').replace('"', '')
          const img = new Image()
          img.src = (path)
          img.onload = function () {
            const material = new THREE.MeshLambertMaterial({ map: loaderJPG.load(path), transparent: true })
            const plane = new THREE.PlaneGeometry(10, 10, 1)
            forms[i] = new THREE.Mesh(plane, material)
            forms[i].position.x += gridx + ((i + 1) * gridxI) // grid placement
            forms[i].position.y += gridy
            forms[i].rotation.y = 0.51
            forms[i].name = JSON.stringify(obj.title)
            forms[i].userData = { URL: pathClick }

            // initial animation
            forms[i].rotation.y = 1

            interactionManager.add(forms[i])
            forms[i].addEventListener('click', (event) => {
              if (store.filter === pathClick) store.setFilter('')
              else store.setFilter(pathClick)
            })
            scene.add(forms[i])
          }
        }
      }
    }

    const updateCamera = () => {
      camera.aspect = aspectRatio.value
      camera.updateProjectionMatrix()
    }

    const updateRenderer = (w:number, h:number) => {
      renderer.setSize(w, h)
      renderer.render(scene, camera)
    }

    watch(aspectRatio, (val) => {
      // if (val) {
      //  const w = width.value * wratio
      //  const h = width.value * hratio
      //  updateCamera()
      //  updateRenderer(w, h)
      // }
    })
    const animate = () => {
      for (let i = 0, j = forms.length; i < j; i++) {
        if (forms[i].rotation.y > 0) forms[i].rotation.y -= 0.2
      }
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    onMounted(() => {
      setCanvas()
      animate()
    })
    return { webGl, height, width }
  }
}
</script>
