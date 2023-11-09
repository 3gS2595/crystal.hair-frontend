<template >
  <div class="container">
    <canvas class="content" ref='webG'/>
  </div>
</template>

<script lang='js'>
import * as THREE from 'three'
import { onMounted, ref, computed, defineComponent } from 'vue'
import { InteractionManager } from 'three.interactive'
import { GlobalStore } from '@/store/GlobalStore'

export default defineComponent ({
  setup () {
    const textInputEl = document.querySelector('#text-input')
    let scene, camera, renderer, textCanvas, textCtx, particleGeometry, particleMaterial, instancedMesh, dummy, clock, cursorMesh
    let rayCaster, mouse, trackingPlane
    let intersect = new THREE.Vector3(10, 3, 7)
    let intersectTarget = intersect.clone()

    const fontName = 'Verdana'
    const textureFontSize = 60
    const fontScaleFactor = .08

    let textureCoordinates = []
    let particles = []
    let stringBox = {
      wTexture: 0,
      wScene: 0,
      hTexture: 0,
      hScene: 0,
      caretPosScene: []
    }
    const webG = ref()
    textInputEl.style.fontSize = textureFontSize + 'px'
    textInputEl.style.font = '100 ' + textureFontSize + 'px ' + fontName
    textInputEl.style.lineHeight = 1.1 * textureFontSize + 'px'
    let string = "Gaze"

    const init = () => {
      // Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 10000)
      camera.position.z = 20
      scene.add(camera)

      scene.add( new THREE.AmbientLight( 0xf0f0f0, 3 ) );
      const light = new THREE.SpotLight( 0xffffff, 4.5 );
      light.position.set( 0, 1500, 200 );
      light.angle = Math.PI * 0.2;
      light.decay = 0;
      light.castShadow = true;
      light.shadow.camera.near = 200;
      light.shadow.camera.far = 2000;
      light.shadow.bias = - 0.000222;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add( light );

      const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
      planeGeometry.rotateX( - Math.PI / 2 );
      const planeMaterial = new THREE.ShadowMaterial( { color: 0x000000, opacity: 0.2 } );

      const plane = new THREE.Mesh( planeGeometry, planeMaterial );
      plane.position.y = - 200;
      plane.receiveShadow = true;
      scene.add( plane );
      const helper = new THREE.GridHelper( 2000, 100 );
      helper.position.y = - 199;
      helper.material.opacity = 0.25;
      helper.material.transparent = true;
      scene.add( helper );

      // Renderer
      const canvas = webG.value
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.render(scene, camera)

      textCanvas = document.createElement('canvas')
      textCanvas.width = textCanvas.height = 0
      textCtx = textCanvas.getContext('2d')
      particleGeometry = new THREE.PlaneGeometry(1, 1)
      const texture = new THREE.TextureLoader().load('smoke.png')
      particleMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        alphaMap: texture,
        depthTest: false,
        opacity: .3,
        transparent: true
      })

      dummy = new THREE.Object3D()
      clock = new THREE.Clock()

      const cursorGeometry = new THREE.BoxGeometry(.15, 4.5, .03)
      cursorGeometry.translate(.2, -2.7, 0)
      const cursorMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
      })
      cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial)
      scene.add(cursorMesh)
    }

    const createEvents = () => {
      window.addEventListener('keyup', () => {
          handleInput()
          refreshText()
      })
      window.addEventListener('resize', () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
      })
    }

    const setCaretToEndOfInput = () => {
      document.execCommand('selectAll', false, null)
      document.getSelection().collapseToEnd()
    }

    const handleInput = () => {
      const textInputEl = document.querySelector('#text-input')
        const isNewLine = (el) => {
          if (el) {
            if (el.tagName) {
              if (el.tagName.toUpperCase() === 'DIV' || el.tagName.toUpperCase() === 'P') {
                if (el.innerHTML === '<br>' || el.innerHTML === '</br>') {
                  return true
                }
             }
           }
        }
        return false
      }
      if (isNewLine(textInputEl.firstChild)) {
        textInputEl.firstChild.remove()
      }
      if (isNewLine(textInputEl.lastChild)) {
        if (isNewLine(textInputEl.lastChild.previousSibling)) {
          textInputEl.lastChild.remove()
        }
      }

      string = textInputEl.innerHTML
        .replaceAll("<p>", "\n")
        .replaceAll("</p>", "")
        .replaceAll("<div>", "\n")
        .replaceAll("</div>", "")
        .replaceAll("<br>", "")
        .replaceAll("<br/>", "")
        .replaceAll("&nbsp;", " ")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")

      stringBox.wTexture = textInputEl.clientWidth
      stringBox.wScene = stringBox.wTexture * fontScaleFactor
      stringBox.hTexture = textInputEl.clientHeight
      stringBox.hScene = stringBox.hTexture * fontScaleFactor
    }
    const render = () => {
      updateParticlesMatrices()
      updateCursorOpacity()

      let lerp = (start, end, amt) => (1 - amt) * start + amt * end
      intersect.x = lerp(intersect.x, intersectTarget.x, .1)
      intersect.y = lerp(intersect.y, intersectTarget.y, .1)
      let cnt = 0
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    const refreshText = () => {
      sampleCoordinates()

      particles = textureCoordinates.map((c, cIdx) => {
        const x = c.x * fontScaleFactor
        const y = c.y * fontScaleFactor
        let p = (c.old && particles[cIdx]) ? particles[cIdx] : new Particle([x, y])
        if (c.toDelete) {
          p.toDelete = true
          p.scale = p.maxScale
        }
        return p
      })

      recreateInstancedMesh()
      makeTextFitScreen()
      updateCursorPosition()
    }

    const sampleCoordinates = () => {

      // Draw text
      const lines = string.split(`\n`)
      const linesNumber = lines.length
      textCanvas.width = stringBox.wTexture
      textCanvas.height = stringBox.hTexture
      textCtx.font = '100 ' + textureFontSize + 'px ' + fontName
      textCtx.fillStyle = '#2a9d8f'
      textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height)
      for (let i = 0; i < linesNumber; i++) {
        textCtx.fillText(lines[i], 0, (i + .8) * stringBox.hTexture / linesNumber)
      }

      // Sample coordinates
      if (stringBox.wTexture > 0) {

        // Image data to 2d array
        const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height)
        const imageMask = Array.from(Array(textCanvas.height), () => new Array(textCanvas.width))
        for (let i = 0; i < textCanvas.height; i++) {
          for (let j = 0; j < textCanvas.width; j++) {
            imageMask[i][j] = imageData.data[(j + i * textCanvas.width) * 4] > 0
          }
        }

        if (textureCoordinates.length !== 0) {

          // Clean up: delete coordinates and particles which disappeared on the prev step
          // We need to keep same indexes for coordinates and particles to reuse old particles properly
          textureCoordinates = textureCoordinates.filter(c => !c.toDelete)
          particles = particles.filter(c => !c.toDelete)

          // Go through existing coordinates (old to keep, toDelete for fade-out animation)
          textureCoordinates.forEach(c => {
            if (imageMask[c.y]) {
              if (imageMask[c.y][c.x]) {
                c.old = true
                if (!c.toDelete) {
                  imageMask[c.y][c.x] = false
                }
              } else {
                c.toDelete = true
              }
            } else {
              c.toDelete = true
            }
          })
        }

        // Add new coordinates
        for (let i = 0; i < textCanvas.height; i++) {
          for (let j = 0; j < textCanvas.width; j++) {
            if (imageMask[i][j]) {
              textureCoordinates.push({
                x: j,
                y: i,
                old: false,
                toDelete: false
              })
            }
          }
        }

      } else {
        textureCoordinates = []
      }
    }

    // ---------------------------------------------------------------
    // Handling params of each particle

    function Particle([x, y])  {
      this.x = x + .15 * (Math.random() - .5)
      this.y = y + .15 * (Math.random() - .5)
      //this.z = x + 1
      //console.log(this.x)
      this.isGrowing = true
      this.toDelete = false

      this.scale = 0
      this.maxScale = .1 + 1.5 * Math.pow(Math.random(), 10)
      this.deltaScale = .03 + .03 * Math.random()
      this.age = Math.PI * Math.random()
      this.ageDelta = .01 + .02 * Math.random()
      this.rotationZ = .5 * Math.random() * Math.PI
      this.deltaRotation = .01 * (Math.random() - .5)

      this.grow = function () {
        this.age += this.ageDelta
        this.rotationZ += this.deltaRotation
        if (this.isGrowing) {
          this.scale += this.deltaScale
          if (this.scale >= this.maxScale) {
            this.isGrowing = false
          }
        } else if (this.toDelete) {
          this.scale -= this.deltaScale
          if (this.scale <= 0) {
            this.scale = 0
            this.deltaScale = 0
          }
        } else {
          this.scale = this.maxScale + .2 * Math.sin(this.age)
        }
      }
    }
    // ---------------------------------------------------------------
    // Handle instances

    const recreateInstancedMesh = () => {
      scene.remove(instancedMesh)
      instancedMesh = new THREE.InstancedMesh(particleGeometry, particleMaterial, particles.length)
      scene.add(instancedMesh)

      instancedMesh.position.x = -.5 * stringBox.wScene
      instancedMesh.position.y = -.6 * stringBox.hScene
    }

    const updateParticlesMatrices = () => {
      let idx = 0
      particles.forEach(p => {
        p.grow()
        dummy.quaternion.copy(camera.quaternion)
        dummy.rotation.z += p.rotationZ
        dummy.scale.set(p.scale, p.scale, p.scale)
        dummy.position.set(p.x, stringBox.hScene - p.y, p.z)
        dummy.updateMatrix()
        instancedMesh.setMatrixAt(idx, dummy.matrix)
        idx ++
      })
      instancedMesh.instanceMatrix.needsUpdate = true
    }

    // ---------------------------------------------------------------
    // Move camera so the text is always visible

    const makeTextFitScreen = () => {
      const fov = camera.fov * (Math.PI / 180)
      const fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect)
      const dx = Math.abs(.7 * stringBox.wScene / Math.tan(.5 * fovH))
      const dy = Math.abs(.6 * stringBox.hScene / Math.tan(.5 * fov))
      const factor = Math.max(dx, dy) / camera.position.length()
      if (factor > 1) {
        camera.position.x *= factor
        camera.position.y *= factor
        camera.position.z *= factor
      }
    }

    // ---------------------------------------------------------------
    // Cursor related

    const updateCursorPosition = () => {
      cursorMesh.position.x = -.5 * stringBox.wScene + stringBox.caretPosScene[0]
      cursorMesh.position.y = .4 * stringBox.hScene - stringBox.caretPosScene[1]
    }

    const updateCursorOpacity = () => {
      let roundPulse = (t) => Math.sign(Math.sin(t * Math.PI)) * Math.pow(Math.sin((t % 1) * 3.14), .2)

      if (document.hasFocus() && document.activeElement === textInputEl) {
        cursorMesh.material.opacity = .7 * roundPulse(2 * clock.getElapsedTime())
      } else {
        cursorMesh.material.opacity = 0
      }
    }

    onMounted(() => {
      init()
      const textInputEl = document.querySelector('#text-input')
      textInputEl.addEventListener('focus', () => {
        clock.elapsedTime = 0
      })
      textInputEl.innerHTML = string
      textInputEl.focus()
      createEvents()
      setCaretToEndOfInput()
      handleInput()
      refreshText()
      render()
    })
    return { webG }
  }
})
</script>

