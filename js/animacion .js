// Configuración básica del canvas
const d = document;
const b = d.body;
const a = d.getElementById('a');
const c = a.getContext("2d");

// Variables globales
let W, H; // Ancho y alto del canvas
let flowers = []; // Array para almacenar las flores
let bunny; // Imagen de texto (emoji de conejo)
const RES = 32; // Resolución base
let hopMode = false;
let hopModeTime = 0;

// Configuración inicial
with (Math) {
    S = sin, C = cos, π = PI, deg = π / 180, R = random, Q = sqrt;
}

with (b.style) {
    margin = 0;
    overflow = "hidden";
    backgroundColor = '#222';
}

// Función para ajustar el tamaño del canvas
function setSize() {
    W = a.width = window.innerWidth;
    H = a.height = window.innerHeight;
    initFlowers(); // Reiniciar las flores cuando cambia el tamaño
}

// Escuchar el evento de redimensionamiento de la ventana
window.addEventListener('resize', setSize);

// Inicializar el tamaño del canvas
setSize();

// Función para calcular la distancia entre dos puntos
function distance(x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1;
    return Q(dx * dx + dy * dy) | 0;
}

// Función para obtener la imagen de un texto
function textImgData(t) {
    const r = [];
    c.clearRect(0, 0, W, RES);
    c.font = RES + "px monospace";
    const w = c.measureText(t).width;
    c.fillStyle = "#fff";
    c.fillText(t, 0, RES);
    const d = c.getImageData(0, 0, w, RES);
    for (let y = 0; y < RES; y++) {
        for (let x = 0; x < w; x++) {
            r.push(d.data[x * 4 + y * RES * 4 + 3] >> 4);
        }
    }
    return { w: w, d: r };
}

// Clase Flower
function Flower(x, y, o) {
    this.x = (W * R()) | 0;
    this.y = (H * R()) | 0;
    this.x1 = x;
    this.y1 = y;
    this.o = o; // Opacidad
}

Flower.prototype.render = function (t) {
    if (this.o < 3) return;
    const x = this.x, y = this.y, r = (H / (RES * 2)) | 0;
    c.save();
    let xx = x, yy = y;
    if (hopMode) {
        const ht = t - hopModeTime;
        xx -= ht * 60;
        while (xx < 0) xx += W + RES * r;
        yy -= Math.abs(S(ht / 2) * 200);
    }
    c.translate(xx, yy);
    c.beginPath();
    c.moveTo(7 / 8 * r + S(t) * r / 4, 0);
    for (let j = 0; j < 36; j++) {
        const i = j * 10;
        const ri = r * 3 / 4 + S(t + i * 8 * deg) * r * 1 / 4;
        c.lineTo(C(i * deg) * ri, S(i * deg) * ri);
    }

    // Colores fijos para asemejar girasoles
    const colors = [
        `rgba(255, 235, 150, ${this.o / 15})`, // Amarillo claro
        `rgba(255, 202, 72, ${this.o / 15})`,  // Dorado
        `rgba(255, 180, 50, ${this.o / 15})`   // Amarillo oscuro
    ];

    // Seleccionar un color aleatorio para cada flor
    c.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    c.fill();
    c.restore();
};

Flower.prototype.move = function () {
    if (this.x < this.x1) this.x += 2;
    if (this.y < this.y1) this.y += 2;
    if (this.x > this.x1) this.x -= 2;
    if (this.y > this.y1) this.y -= 2;
};

Flower.prototype.hasArrived = function () {
    return distance(this.x, this.y, this.x1, this.y1) <= 2;
};

// Inicializar las flores
function initFlowers() {
    bunny = textImgData("\uD83D\uDC07");
    flowers = [];
    const dY = H >> 5; // Espaciado vertical

    // Calcular el centro del canvas
    const centerX = (W - bunny.w * 32) / 2;
    const centerY = (H - RES * dY) / 2;

    for (let y = 0; y < RES; y++) {
        for (let x = 0; x < bunny.w; x++) {
            flowers.push(new Flower(centerX + x * 32, centerY + y * dY, bunny.d[y * bunny.w + x]));
        }
    }
}

// Función de animación
function animate(t) {
    t /= 1e2;
    c.fillStyle = "#222";
    c.fillRect(0, 0, W, H);
    hopMode = true;
    for (let f = flowers.length; f--;) {
        if (!flowers[f].hasArrived()) {
            hopMode = false;
            hopModeTime = t;
            break;
        }
    }
    for (let f = flowers.length; f--;) {
        flowers[f].render(t);
        flowers[f].move();
    }
    requestAnimationFrame(animate);
}

// Redirección después de 7 segundos
setTimeout(() => {
    window.location.href = "Contenido.html"; // Cambia "Contenido.html" por la ruta correcta
}, 13000);

// Iniciar la animación
initFlowers();
animate(0);