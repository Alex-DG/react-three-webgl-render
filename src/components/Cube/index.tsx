import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

//@ts-ignore
import threeOrbitControls from 'three-orbit-controls'

const Cube = ({ asset }: any) => {
  const canvas = useRef(null)
  const scene = new THREE.Scene()
  const orbitControls = threeOrbitControls(THREE)
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  })

  let frameId: number

  let camera: THREE.PerspectiveCamera
  let mesh: THREE.Mesh
  let controls: threeOrbitControls

  const initializeOrbits = () => {
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
  }
  const initializeCamera = () => {
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 400
  }

  const init = () => {
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000)

    controls = new orbitControls(camera, renderer.domElement)

    initializeOrbits()
    initializeCamera()

    const texture = new THREE.TextureLoader().load(asset)
    const geometry = new THREE.BoxBufferGeometry(120, 120, 120)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    if (canvas && canvas.current)
      //@ts-ignore
      canvas.current.appendChild(renderer.domElement)

    window.addEventListener('resize', onWindowResize, false)
  }

  const animate = () => {
    frameId = requestAnimationFrame(animate)

    mesh.rotation.x += 0.005
    mesh.rotation.y += 0.01

    scene.background = new THREE.Color(0xffffff)
    renderer.render(scene, camera)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  useEffect(() => {
    init()
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', onWindowResize)
    }
  }, [init, animate])

  return <div id="canvas" ref={canvas} />
}

export default Cube
