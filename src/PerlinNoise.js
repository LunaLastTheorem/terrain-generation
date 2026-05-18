export class PerlinNoise {
    constructor(nodes = 5) {
        this.nodes = nodes
        this.grid = []

        this.generateGrid()
    }

    generateGrid() {
        for (let i = 0; i < this.nodes; i++) {
            let row = []

            for (let j = 0; j < this.nodes; j++) {
                row.push(this.randomUnitVector())
            }

            this.grid.push(row)
        }
    }

    randomUnitVector() {
        let theta = Math.random() * 2 * Math.PI;
        return { x: Math.cos(theta), y: Math.sin(theta) };
    }

    fade(t) {
        return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
    }

    lerp(x, a, b) {
        return a + x * (b - a);
    }

    get(x, y) {
        let x0 = Math.floor(x);
        let x1 = x0 + 1;
        let y0 = Math.floor(y);
        let y1 = y0 + 1;

        const sx = this.fade(x - x0);
        const sy = this.fade(y - y0);

        const n0 = this.dotProductGrid(x, y, x0, y0);
        const n1 = this.dotProductGrid(x, y, x1, y0);
        const ix0 = this.lerp(sx, n0, n1);

        const n2 = this.dotProductGrid(x, y, x0, y1);
        const n3 = this.dotProductGrid(x, y, x1, y1);
        const ix1 = this.lerp(sx, n2, n3);

        const value = this.lerp(sy, ix0, ix1);

        return (value + 1) / 2;
    }

    dotProductGrid(x, y, gx, gy) {
        gx = gx % this.nodes
        gy = gy % this.nodes

        if (gx < 0) gx += this.nodes
        if (gy < 0) gy += this.nodes

        const gradient = this.grid[gx][gy];
        const dx = x - gx;
        const dy = y - gy;
        return dx * gradient.x + dy * gradient.y;
    }

}