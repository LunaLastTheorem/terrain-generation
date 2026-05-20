import * as THREE from 'three';
import { PerlinNoise } from './PerlinNoise';

export class TerrainMesh {
    constructor(size = 1000, resolution = 200, settings) {
        this.size = size;
        this.resolution = resolution;
        this.settings = settings;
        this.height = settings.height;
        this.noise = new PerlinNoise(64);
        this.mesh = this._build();
    }

    rebuild() {
        this.noise = new PerlinNoise(64)
        this.mesh = this._build()
    }

    update(settings) {
        const geometry = this.mesh.geometry
        const colors = [];
        const color = new THREE.Color()
        const h = this.settings.height

        const pos = geometry.attributes.position;

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            let y = this.getHeight(x, z);

            const waterY =
                (this.settings.waterLevel - 0.5) *
                this.settings.height;

            if (y < waterY) {
                y = waterY;
            }
            pos.setY(i, y);

            if (y <= waterY) {
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

    fractalNoise(x, z, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
        let amplitude = 1;
        let frequency = 1;
        let total = 0;
        let maxValue = 0;

        for (let i = 0; i < octaves; i++) {
            total += this.noise.get(
                x * frequency,
                z * frequency
            ) * amplitude;

            maxValue += amplitude;

            amplitude *= persistence;
            frequency *= lacunarity;
        }

            return total / maxValue;
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
        const h = this.settings.height

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            const y = this.getHeight(x, z);

            const waterY =
                (this.settings.waterLevel - 0.5) *
                this.settings.height;

            if (y < waterY) {
                y = waterY;
            }

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

    getHeight(x, z) {
        const s = this.settings;

        const nx = ((x + this.size * 0.5) / this.size) * s.frequency;
        const nz = ((z + this.size * 0.5) / this.size) * s.frequency;

        let n = this.fractalNoise(
            nx,
            nz,
            s.octaves,
            s.persistence,
            s.lacunarity
        );

        n = Math.max(0, Math.min(1, n));

        n = Math.pow(n, s.redistribution);

        return (n - 0.5) * s.height;
    }

    getMesh() {
        return this.mesh;
    }
}