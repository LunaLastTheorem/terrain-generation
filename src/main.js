import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { add } from 'three/src/nodes/math/OperatorNode.js';
import GUI from 'lil-gui'

const keys = {
  w: false,
  s: false,
  a: false,
  d: false,
}

document.addEventListener('keydown', (e) =>{
  if (e.key.toLocaleLowerCase() in keys){
    keys[e.key.toLocaleLowerCase()] = true
  }
})

document.addEventListener('keyup', (e) =>{
  if (e.key.toLocaleLowerCase() in keys){
    keys[e.key.toLocaleLowerCase()] = false
  }
})

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const container = document.querySelector("#canvas-container")

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
camera.position.setZ(30);
const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshNormalMaterial()
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

const gui = new GUI()

const settings = {
  rotationSpeed: 0.01,
}

gui.add(settings, 'rotationSpeed', 0, 0.2, 0.001).name('Rotation Speed')

renderer.render(scene, camera)
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += settings.rotationSpeed
  cube.rotation.y += settings.rotationSpeed
  
  controls.update()
  renderer.render(scene, camera)
}

animate()