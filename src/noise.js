let grid = [];
const nodes = 5;

function random_unit_vector(){
    let theta = Math.random() * 2 * Math.PI;
    return {x : Math.cos(theta), y: Math.sin(theta)};
}

for (let i = 0; i <= nodes; i++){
    let row = [];
    for (let j = 0; j <= nodes; j++){
        row.push(random_unit_vector());
    }
    grid.push(row);
}

function fade(t) {
    return 6*t**5 - 15*t**4 + 10*t**3;
}

function perlin_get(x, y){
    let x0 = Math.floor(x);
    let x1 = x0  + 1;
    let y0 = Math.floor(y);
    let y1 = y0 + 1;

    const sx = fade(x - x0);
    const sy = fade(y - y0);

    const n0 = dot_prod_grid(x, y, x0, y0);
    const n1 = dot_prod_grid(x, y, x1, y0);
    const ix0 = linear_interpolation(sx, n0, n1);

    const n2 = dot_prod_grid(x, y, x0, y1);
    const n3 = dot_prod_grid(x, y, x1, y1);
    const ix1 = linear_interpolation(sx, n2, n3);

    const value = linear_interpolation(sy, ix0, ix1);

    return (value + 1) / 2;
}

function dot_prod_grid(x, y, gx, gy){
    const gradient = grid[gx][gy];
    const dx = x - gx;
    const dy = y - gy;
    return dx * gradient.x + dy * gradient.y;
}

function linear_interpolation(x, a, b){
    return a + x * (b - a);
}

const canvas = document.querySelector('#bg');
const ctx = canvas.getContext("2d");

const width = canvas.width;
const height = canvas.height;

for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const value = perlin_get(x / 50, y / 50);
        const color = Math.floor(value * 255);

        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
        ctx.fillRect(x, y, 1, 1);
    }
}