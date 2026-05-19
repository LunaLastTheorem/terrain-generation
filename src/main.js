import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { add } from 'three/src/nodes/math/OperatorNode.js';
import GUI from 'lil-gui'
import { TerrainMesh } from './TerrainMesh';

const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
}

document.addEventListener('keydown', (e) => {
  if (e.key.toLocaleLowerCase() in keys) {
    keys[e.key.toLocaleLowerCase()] = true
  }
})

document.addEventListener('keyup', (e) => {
  if (e.key.toLocaleLowerCase() in keys) {
    keys[e.key.toLocaleLowerCase()] = false
  }
})

const gui = new GUI()

const settings = {
  frequency: 0.01,
  redistribution: 0.01,
  waterLevel: 0.01,
  regenerateFunction: function() {
    scene.remove(terrain.getMesh())
    terrain.rebuild()
    scene.add(terrain.getMesh())
  },
  height: 60,
}

gui.add(settings, 'frequency', 0, 0.2, 0.001).name('Frequency').onChange(() => terrain.update(settings))
gui.add(settings, 'redistribution', 0, 3, 0.001).name('Elevation').onChange(() => terrain.update(settings))
gui.add(settings, 'waterLevel', 0, 1, 0.01).name('Water Level').onChange(() => terrain.update(settings))
gui.add(settings, 'height', 0, 1500, 10).name('Height').onChange(() => terrain.update(settings))
gui.add(settings, 'regenerateFunction').name('Regenerate')

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

const container = document.querySelector("#canvas-container")

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);

camera.position.set(0, 100, 150)
camera.lookAt(0,0,0)
const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(10, 20, 10)


scene.add(cube)
const terrain = new TerrainMesh(5000, 500, 600)

scene.add(terrain.getMesh())

scene.add(light)
scene.add(new THREE.AmbientLight(0xffffff, 0.3))

renderer.render(scene, camera)
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}

animate()