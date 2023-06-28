
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
import * as THREE from 'three'
import { watch, onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { useCounterStore } from '../store/GlobalStore'
import { InteractionManager } from 'three.interactive'
// import { useWindowSize } from "@vueuse/core";

export default {
  setup () {
    const store = useCounterStore()
    const manager = new THREE.LoadingManager()
    const loaderJPG = new THREE.TextureLoader(manager)
    store.setFilter('testing3')
    console.log(store.filter)
    const webGl = ref()
    const forms = []

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

      // Creates post-api reception
      const apij = ref()
      ;(async () => {
        const res = await fetch('http://192.168.1.180:3000//site_images').then(res => res.json())
        apij.value = res
        console.log(res)
        if (apij.value === undefined) {
          console.log('hddelp')
          console.log(apij.value.length)
        }
        if (apij.value !== undefined) {
          console.log(apij.value.length)
          for (let i = 0; i < apij.value.length; i++) {
            console.log(i)
            const obj = JSON.parse(JSON.stringify(apij.value[i]))
            const path = ('require(\'@/src/assets/' + JSON.stringify(obj.path) + '\')').replace('"', '').replace('"', '')
            console.log(path)
            const pathClick = (JSON.stringify(obj.title)).replace('"', '').replace('"', '')
            const img = new Image()
            img.src = path
            img.onload = function(){
              let material = new THREE.MeshLambertMaterial({map:loaderJPG.load(path), transparent: true})
              var plane = new THREE.PlaneGeometry( 10, 10, 1)
              forms[i] = new THREE.Mesh(plane,material)
              forms[i].position.x += gridx + ((i+1) * gridxI) //grid placement
				    	forms[i].position.y += gridy
				  	  forms[i].name = JSON.stringify(obj.title)
				  	  forms[i].userData = { URL: pathClick}

				  	  //initial animation
					    forms[i].rotation.y = 1

					    forms[i].addEventListener('mouseover', (event) => {
				  		  if (forms[i].material) {
					  	  	forms[i].userData.materialEmissiveHex = forms[i].material.emissive.getHex()
						     	forms[i].material.emissive.setHex(0xff0000)
						    	forms[i].material.emissiveIntensity = 0.1
						     	forms[i].rotation.x += .2
				  	  	}
			  	  	});

			  	  	forms[i].addEventListener('mouseout', (event) => {
				    		if (forms[i].material) {
				    			forms[i].material.emissive.setHex( forms[i].userData.materialEmissiveHex )
				    			forms[i].rotation.x -= .2
				     		}
			    		});

				     	interactionManager.add(forms[i])
			  		  console.log('\'' + pathClick + '\'')
			  		  forms[i].addEventListener('click', (event) => {
			  			  if(filter == pathClick) setFilter('')
				  		  else setFilter(pathClick)
			  		  });
			  		  scene.add(forms[i])
		  		  }
          }
          // mesh.addEventListener('click', (event) => {
          //  console.log(store.filter)
          // })
          scene.add(mesh)
        }
      })()

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
