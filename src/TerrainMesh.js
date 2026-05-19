import * as THREE from 'three';
import { PerlinNoise } from './PerlinNoise';

export class TerrainMesh {
    constructor(size = 1000, resolution = 200, height = 15) {
        this.size = size;
        this.resolution = resolution;
        this.height = height;
        this.noise = new PerlinNoise(8);
        this.mesh = this._build();
    }

    rebuild() {
        this.noise = new PerlinNoise(8)
        this.mesh = this._build()
    }

    update(settings) {
        const geometry = this.mesh.geometry
        
        const pos = geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const nx = (x / this.size + 0.5) * 4;
            const nz = (z / this.size + 0.5) * 4;

            let n = 0;
            n += 1.0 * this.noise.get(nx * 1, nz * 1);
            n = Math.pow(n + 1, settings.redistribution)

            const y = n * this.height;
            pos.setY(i, y);
        }

        geometry.attributes.position.needsUpdate = true
        geometry.computeVertexNormals()
    }

    _build() {
        const geometry = new THREE.PlaneGeometry(
            this.size,
            this.size,
            this.resolution,
            this.resolution
        );

        geometry.rotateX(-Math.PI / 2);

        const pos = geometry.attributes.position;
        const colors = [];

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const nx = (x / this.size + 0.5) * 4;
            const nz = (z / this.size + 0.5) * 4;

            let n = 0;
            n += 1.0 * this.noise.get(nx * 1, nz * 1);

            const y = n * this.height;
            pos.setY(i, y);
        }


        const material = new THREE.MeshStandardMaterial({
            color: 0x88aa66,
            wireframe: false,
            side: THREE.DoubleSide,
        })

        return new THREE.Mesh(geometry, material);
    }

    getMesh() {
        return this.mesh;
    }
}