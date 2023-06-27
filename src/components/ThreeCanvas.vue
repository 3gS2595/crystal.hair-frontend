
<template >
  <canvas ref='webGl' class='webGl' />
</template>

<script lang='ts'>
import {
  Scene,
  SphereGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Mesh,
  PointLight,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  HemisphereLight
} from 'three'
import { watch, onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useCounterStore } from '../store/GlobalStore'
import { InteractionManager } from 'three.interactive'
// import { useWindowSize } from "@vueuse/core";

export default {
  setup () {
    const store = useCounterStore()
    store.setFilter('testing3')
    console.log(store.filter)
    const webGl = ref()
    const apij = ref()
    ;(async () => {
      const res = await fetch('http://192.168.1.180:3000//site_images').then(res => res.json())
      apij.value = res.data
      console.log(res)
    })()

    store.setFilter('test3')
    console.log(store.filter)
    const img = '../assets/images/earth.jpg'
    const width = 600
    const height = 600
    const aspectRatio = computed(() => {
      return 100 / 100
    })
    let camera: PerspectiveCamera
    let renderer: WebGLRenderer
    let scene: Scene
    let mesh: Mesh
    let light: PointLight
    const setCanvas = () => {
      // Create Scene
      scene = new Scene()

      // Create Object
      const geometry = new SphereGeometry(5, 50, 50)
      const material = new MeshStandardMaterial({ color: '#F00' })
      mesh = new Mesh(geometry, material)
      if (apij.value !== null) {
        mesh.addEventListener('click', (event) => {
          console.log(store.filter)
        })
        scene.add(mesh)
      }

      // Lights
      light = new PointLight(0xffffff, 1)
      light.position.set(50, 50, 50)
      scene.add(light)

      // Camera
      camera = new PerspectiveCamera(45, aspectRatio.value, 0.1, 100)
      camera.position.z = 30
      scene.add(camera)
      camera.add(light)

      // Renderer
      const canvas = webGl.value
      renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setSize(width, height)
      renderer.render(scene, camera)
    }

    const updateCamera = () => {
      camera.aspect = aspectRatio.value
      camera.updateProjectionMatrix()
    }

    const updateRenderer = () => {
      renderer.setSize(width, height)
      renderer.render(scene, camera)
    }

    watch(aspectRatio, (val) => {
      if (val) {
        updateCamera()
        updateRenderer()
      }
    })

    const animate = () => {
      mesh.rotation.y += 0.01
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    onMounted(() => {
      setCanvas()
      animate()
    })

    return { webGl }
  }
}
</script>
