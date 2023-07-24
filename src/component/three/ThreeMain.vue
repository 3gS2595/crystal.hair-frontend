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
import * as THREE from 'three'
import { onMounted, ref, computed } from 'vue'
import { InteractionManager } from 'three.interactive'

import { useCounterStore } from '@/store/GlobalStore'

let interactionManager: InteractionManager

export default {
  props: {
    imageData: {
      type: Array,
      default: () => [],
      validator: function (value: string) {
        return (
          ['syncing', 'synced', 'version-conflict', 'error'].indexOf(value) !==
          -1
        )
      }
    }
  },
  setup (props) {
    const manager = new THREE.LoadingManager()
    const loaderJPG = new THREE.TextureLoader(manager)
    const store = useCounterStore()
    const webGl = ref()
    const forms: THREE.Mesh[] = []
    const width = ref(700)
    const height = ref(110)
    const aspectRatio = computed(() => {
      return (width.value) / (height.value)
    })

    let renderer: THREE.WebGLRenderer
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    let light: THREE.AmbientLight
    let loadRot = false

    const setCanvas = () => {
      // Create Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(9, aspectRatio.value, 10, 80)
      camera.position.z = 63
      scene.add(camera)

      // Lights
      light = new THREE.AmbientLight(0xffffff)
      scene.add(light)

      // Renderer
      const canvas = webGl.value
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      renderer.setSize(width.value, height.value)
      renderer.render(scene, camera)

      // Interaction Manager
      interactionManager = new InteractionManager(renderer, camera, renderer.domElement)

      // Creates post-api reception
      const apij = ref()
      const res = props.imageData
      apij.value = res

      if (apij.value !== undefined) {
        console.log(apij.value)
        for (let i = 0; i < apij.value.length; i++) {
          const obj = JSON.parse(JSON.stringify(apij.value[i]))
          console.log(('/img/' + JSON.stringify(obj.logo_path)).replace('"', '').replace('"', ''))
          const path = ('/img/' + JSON.stringify(obj.logo_path)).replace('"', '').replace('"', '')
          const img = new Image()
          img.src = (path)
          img.onload = function () {
            const material = new THREE.MeshLambertMaterial({ map: loaderJPG.load(path), transparent: true })
            const plane = new THREE.PlaneGeometry(10, 8, 1)
            forms[i] = new THREE.Mesh(plane, material)
            forms[i].name = JSON.stringify(obj.name)
            forms[i].userData = { URL: (JSON.stringify(obj.url)).replace('"', '').replace('"', '') }

            // grid placement
            forms[i].position.x += -35 + ((i + 1) * 10.85)

            // initial animation
            forms[i].rotation.y = 1

            interactionManager.add(forms[i])
            forms[i].addEventListener('click', () => {
              if (store.filter === forms[i].userData.URL) store.setFilter('')
              else store.setFilter(forms[i].userData.URL)
            })
            scene.add(forms[i])
          }
        }
        loadRot = true
      }
    }

    const animate = () => {
      for (let i = 0, j = forms.length; i < j; i++) {
        if (forms[i].rotation.y > 0 && loadRot) forms[i].rotation.y -= 0.02
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
