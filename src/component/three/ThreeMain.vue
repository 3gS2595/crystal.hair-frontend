<template >
  <Suspense>

    <template #default>
      <canvas ref='webGl'/>
    </template>

    <template #fallback>
      <a>Loading...</a>
    </template>

  </Suspense>
</template>

<script lang='ts'>
import * as THREE from 'three'
import { onMounted, ref, computed } from 'vue'
import { InteractionManager } from 'three.interactive'

import { filterStore } from '@/store/FilterStore'

export default {
  props: {
    imageData: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const store = filterStore()
    const webGl = ref()
    const forms: THREE.Mesh[] = []
    const width = ref(1500)
    const height = ref(200)

    let renderer: THREE.WebGLRenderer
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    let light: THREE.AmbientLight

    const setCanvas = () => {
      // Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(9, (width.value/height.value), 10, 80)
      camera.position.z = 78
      scene.add(camera)

      // Lights
      light = new THREE.AmbientLight(0xffffff)
      scene.add(light)

      // Renderer
      const canvas = webGl.value
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, precision: 'highp', antialias: true })
      renderer.setSize(width.value, height.value)
      renderer.render(scene, camera)

      // Interaction Manager
      const interactionManager = new InteractionManager(renderer, camera, renderer.domElement)

      // Creates post-api reception
      const apij = ref()
      const res = props.imageData
      apij.value = res

      if (apij.value !== undefined) {
        console.log(apij.value)
        for (let i = 0; i < apij.value.length; i++) {
          const obj = JSON.parse(JSON.stringify(apij.value[i]))
          const path = ('img/' + JSON.stringify(obj.logo_path)).replace('"', '').replace('"', '')
          const loader = new THREE.TextureLoader()

          loader.load(path, function (texture) {
            const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true })
            const plane = new THREE.PlaneGeometry(10, 8, 1)
            forms[i] = new THREE.Mesh(plane, material)
            forms[i].name = JSON.stringify(obj.name)
            forms[i].userData = { URL: (JSON.stringify(obj.url)).replace('"', '').replace('"', '') }

            // grid placement
            forms[i].position.x += -51 + ((i + 1) * 10.85)
            forms[i].position.y -= 1
            // initial animation
            forms[i].rotation.y = 1

            // filter click
            interactionManager.add(forms[i])
            forms[i].addEventListener('click', () => {
              store.setMixtape('')
              if (store.filter === forms[i].userData.URL) store.setFilter('')
              else store.setFilter(forms[i].userData.URL)
            })
            scene.add(forms[i])
          })
        }
      }
    }
    const animate = () => {
      for (let i = 0, j = forms.length; i < j; i++) {
        if (forms[i] !== undefined) {
          if (forms[i].rotation.y > 0) {
            forms[i].rotation.y -= 0.02
          }
        } else { console.log(i) }
      }
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
