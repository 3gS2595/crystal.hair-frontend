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
import { onMounted, ref, computed, defineComponent } from 'vue'
import { InteractionManager } from 'three.interactive'

import { GlobalStore } from '@/store/GlobalStore'

export default defineComponent ({
  props: {
    imageData: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const store = GlobalStore()
    const webGl = ref()
    const group_cards = new THREE.Group();
    const width = ref(1500)
    const height = ref(200)
    const image_radius = 10
    const radius = 5
let wheel_theta = 0.0;
let spin_in_progress = false;
let snap_in_progress = false;
    const clock = new THREE.Clock();
let delta = 0.0;
let duration = 3;
let current_time = duration;
let target = 0.0;



    const center_of_wheel = {
      x: 0,
      y: 0
    }

    let renderer: THREE.WebGLRenderer
    let camera: THREE.PerspectiveCamera
    let scene: THREE.Scene
    let light: THREE.AmbientLight

    const setCanvas = () => {
      // Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(9, (width.value/height.value), 0.1, 800)
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
        const number_of_images = apij.value.length
        const radian_interval = (2.0 * Math.PI) / number_of_images
        for (let i = 0; i < apij.value.length; i++) {
          const obj = JSON.parse(JSON.stringify(apij.value[i]))
          const path = ('img/' + JSON.stringify(obj.logo_path)).replace('"', '').replace('"', '')
          const loader = new THREE.TextureLoader()

          loader.load(path, function (texture) {
            const material = new THREE.MeshLambertMaterial({ map: texture, transparent: true })
            const plane = new THREE.PlaneGeometry(10, 8, 1)
            const mesh = new THREE.Mesh(plane, material)
            mesh.name = JSON.stringify(obj.name)
            mesh.userData = { URL: (JSON.stringify(obj.url)).replace('"', '').replace('"', '') }

            // grid placement
            mesh.position.set(
              center_of_wheel.x + (Math.cos(radian_interval * i) * radius),
              center_of_wheel.y + (Math.sin(radian_interval * i) * radius),
              0
            );

            // filter click
            interactionManager.add(mesh)
            mesh.addEventListener('click', () => {
              store.setMixtape('')
              if (store.filter === mesh.userData.URL) store.setFilter('')
              else store.setFilter(mesh.userData.URL)
            })
            group_cards.add(mesh); 
          })
        }
      }
      scene.add(group_cards)
      let scroll_speed = 0.0;
      window.addEventListener('wheel', event => {
        if (!snap_in_progress) {
          clearTimeout(spin_in_progress);
          scroll_speed = event.deltaY * (Math.PI / 180) * 0.2;
          group_cards.rotation.z += -1.0 * scroll_speed;
          for (let i = 0; i < group_cards.children.length; i++) {
                          group_cards.children[i].scale.set(1, 1, 1);
                          group_cards.children[i].rotation.z += 
                                                             scroll_speed;
          }
          spin_in_progress = setTimeout(() => {
            snap_back();
          }, 100);
        } else {
            return;
        }
      });
    }
    const animate = () => {
    delta = clock.getDelta();

    if (snap_in_progress) {
        current_time -= delta;

        if (current_time < 0) {
            current_time = duration;
            wheel_theta = group_cards.rotation.z;
            target = 0.0;

            snap_in_progress = false;
        } else {
            group_cards.rotation.set(0, 0, wheel_theta + (target * (1.0 - (current_time / duration))));

            for (let i = 0; i < group_cards.children.length; i++) {
                group_cards.children[i].rotation.set(0, 0, -1.0 * (wheel_theta + (target * (1.0 - (current_time / duration)))));
            }
        }
    }

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
          }

  let active_cards_index = 0;
  const snap_back = () => {
let dummy_vec3 = new THREE.Vector3() 
const snap_point = {
            x: Math.floor(group_cards.children[2].position.x),
            y: Math.floor(group_cards.children[2].position.y),
            theta: 0.0
                   }
snap_point.theta = Math.abs(Math.atan2(snap_point.y, snap_point.x));
    let shortest_distance =
        Math.sqrt(
            Math.pow(group_cards.children[0].getWorldPosition(dummy_vec3).x - snap_point.x, 2) +
            Math.pow(group_cards.children[0].getWorldPosition(dummy_vec3).y - snap_point.y, 2)
        );

    // loop through all cards and compare distances to snap_point; find shortest distance
    for (let i = 0; i < group_cards.children.length; i++) {
        let dx = Math.pow(group_cards.children[i].getWorldPosition(dummy_vec3).x - snap_point.x, 2);
        let dy = Math.pow(group_cards.children[i].getWorldPosition(dummy_vec3).y - snap_point.y, 2);
        let current_distance = Math.sqrt(dx + dy);

        if (shortest_distance >= current_distance) {
            shortest_distance = current_distance;
            active_cards_index = i;
        }
    }

    // find angle between snap_point's theta and closest_card's theta
    let closest_cards_x = group_cards.children[active_cards_index].getWorldPosition(dummy_vec3).x
    let closest_cards_y = group_cards.children[active_cards_index].getWorldPosition(dummy_vec3).y;
    let closest_cards_theta = Math.abs(Math.atan2(closest_cards_y, closest_cards_x));

    // find the degree distance between the snap point and current card
    let theta_between = snap_point.theta >= closest_cards_theta ?
        snap_point.theta - closest_cards_theta :
        closest_cards_theta - snap_point.theta;

    // decide whether to make a positive or negative degree shift
    if (closest_cards_x > 0.0 && closest_cards_y >= 0.0) { // QI
        theta_between = closest_cards_theta > snap_point.theta ? -1.0 * theta_between : theta_between;
    } else if (closest_cards_x <= 0.0 && closest_cards_y >= 0.0) { // QII
        theta_between = closest_cards_theta > snap_point.theta ? -1.0 * theta_between : theta_between;
    } else if (closest_cards_x <= 0.0 && closest_cards_y < 0.0) { // QIII
        theta_between = Math.PI + (Math.PI - closest_cards_theta) > snap_point.theta ? -1.0 * theta_between : theta_between;
    } else if (closest_cards_x > 0.0 && closest_cards_y <= 0.0) { // QIV
        theta_between = (2.0 * Math.PI) - closest_cards_theta > snap_point.theta ? theta_between : -1.0 * theta_between;
    }

    // rotate wheel towards snap point
    setTimeout(() => {
        target = theta_between;
        wheel_theta = group_cards.rotation.z;
        snap_in_progress = true;
    }, 100);
  }

    onMounted(() => {
      setCanvas()
      animate()
       resizeObserver.observe(document.getElementsByTagName('canvas')[0])
    })
    return { webGl }
  }
})
</script>
