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
        const colors = [];
        const color = new THREE.Color()
        const h = settings.height

        const pos = geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const nx = (x / this.size + 0.5) * 4;
            const nz = (z / this.size + 0.5) * 4;

            let n = 0;
            n += 1.0 * this.noise.get(nx * 1, nz * 1);
            n = Math.pow(n, settings.redistribution)

            const waterY = (settings.waterLevel - 0.5) * h
            const y = Math.max((n - 0.5) * h, waterY);
            pos.setY(i, y);

            if (y <= waterY + 0.01) {
                color.set(0x1e90ff);
            } else if (y < -h * 0.1) {
                color.set(0xd9c28a);
            } else if (y < h * 0.2) {
                color.set(0x3f7c47);
            } else if (y < h * 0.4) {
                color.set(0x777777);
            } else {
                color.set(0xffffff);
            }

            colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );

        geometry.attributes.position.needsUpdate = true
        geometry.attributes.color.needsUpdate = true
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
        const color = new THREE.Color()
        const h = this.height

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const nx = (x / this.size + 0.5) * 4;
            const nz = (z / this.size + 0.5) * 4;

            let n = 0;
            n += 1.0 * this.noise.get(nx * 1, nz * 1);

            const y = (n - 0.5) * this.height;
            pos.setY(i, y);

            if (y < -h * 0.25) {
                color.set(0x1e90ff);
            } else if (y < -h * 0.1) {
                color.set(0xd9c28a);
            } else if (y < h * 0.2) {
                color.set(0x3f7c47);
            } else if (y < h * 0.4) {
                color.set(0x777777);
            } else {
                color.set(0xffffff);
            }

            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );


        const material = new THREE.MeshStandardMaterial({
            vertexColors: true,
            side: THREE.DoubleSide,
        })

        return new THREE.Mesh(geometry, material);
    }

    getMesh() {
        return this.mesh;
    }
}