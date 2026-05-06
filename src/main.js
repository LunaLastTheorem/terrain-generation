import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { add } from 'three/src/nodes/math/OperatorNode.js';

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

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera)

const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xFFFFFF);

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial( {color : 0xffffff})
  const star = new THREE.Mesh(geometry, material)

  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

  star.position.set(x, y, z)
  scene.add(star)
}

Array(200).fill().forEach(addStar)

const jerryTexture = new THREE.TextureLoader().load('screen.png');
scene.background = jerryTexture

const jerry = new THREE.Mesh(
  new THREE.ConeGeometry(5,5,3,),
  new THREE.MeshBasicMaterial( {map: jerryTexture} )
)

scene.add(pointLight, ambientLight)
scene.add(jerry)

function animate() {
  requestAnimationFrame(animate)

  // jerry.rotation.y -= 0.01;
  if (keys['w']) jerry.rotation.x += 0.01;
  if (keys['a']) jerry.rotation.y += 0.01;
  if (keys['s']) jerry.rotation.x -= 0.01;
  if (keys['d']) jerry.rotation.y -= 0.01;
  

  controls.update()

  renderer.render(scene, camera)
}

animate()