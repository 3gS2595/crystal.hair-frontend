<template >
<Suspense>
  <template #fallback>
    <a>Loading...</a>
  </template>

  <template #default>
    <canvas ref='webGl' class='webGl' />
  </template>
 </Suspense>
</template>

<script lang='ts'>
import * as THREE from 'three'
import { watch, onMounted, ref, computed } from 'vue'
import { InteractionManager } from 'three.interactive'
let interactionManager: InteractionManager

export default {
  props: {
    imageData: {
      type: Array,
      default: () => []
    },
    size: {
      type: Array,
      default: () => []
    }
  },

  setup (props: any) {
    const manager = new THREE.LoadingManager()
    const loaderJPG = new THREE.TextureLoader(manager)
    const webGl = ref()

    let renderer: THREE.WebGLRenderer
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    const width = ref()
    const height = ref()
    const aspectRatio = computed(() => {
      return (width.value) / (height.value)
    })

    const light: THREE.PointLight[] = []
    const forms: THREE.Mesh[] = []

    const setCanvas = () => {
      const canvas = webGl.value
      width.value = props.size[0]
      height.value = props.size[1]
      // Create Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(9, aspectRatio.value, 10, 80)
      camera.position.z = 63
      scene.add(camera)
      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      renderer.setSize((width.value), (height.value))
      renderer.render(scene, camera)

      // Lights
      light[0] = new THREE.PointLight(0xfffeff, 1.0)
      light[0].position.set(50, 50, 50)
      scene.add(light[0])

      // Interaction Manager
      interactionManager = new InteractionManager(renderer, camera, renderer.domElement)

      // Creates post-api reception
      const path = (props.imageData)
      const img = new Image()
      img.src = (path)
      img.onload = function () {
        const material = new THREE.MeshLambertMaterial({ map: loaderJPG.load(path), transparent: true })
        const plane = new THREE.PlaneGeometry(10, 10, 1)
        forms[0] = new THREE.Mesh(plane, material)
        forms[0].position.x = 0
        forms[0].position.y = 0

        interactionManager.add(forms[0])
        scene.add(forms[0])
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

    const animate = () => {
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
