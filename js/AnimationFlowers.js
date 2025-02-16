let fArray = [];
let painting;
let hatchSize = 100;
let hatchToggle = true;
let cx, cy;
let chatchSize = 100;
let bg;

function preload() {
    bg = loadImage('https://assets.codepen.io/9234665/sunflowers.jpeg');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(60); // Velocidad de fotogramas por defecto (60 FPS)
    strokeWeight(0.8);

    // Calcular puntos focales
    const numFocalPoints = 1000;
    const spacingX = width / (numFocalPoints + 1);
    const spacingY = height / (numFocalPoints + 1);

    for (let i = 1; i <= numFocalPoints; i++) {
        const focalPoint = createVector(i * spacingX, i * spacingY);
        fArray.push(focalPoint);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

let hatchDelay = 1;

function draw() {
    if (hatchToggle) {
        if (frameCount % hatchDelay === 0) {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < fArray.length; j++) {
                    circleHatch(fArray[j].x, fArray[j].y);
                }
            }

            // Reducir hatchSize más rápidamente para una duración de 2 a 4 segundos
            if (hatchSize > 5) {
                hatchSize -= 1.0; // Ajusta este valor para controlar la duración
            }
        }
    }
}

function circleHatch(cx, cy) {
    let x = random(0, width);
    let y = random(0, height);
    let pixCol = bg.get(bg.width / (width / x), bg.height / (height / y));
    stroke(pixCol);
    let r = dist(cx, cy, x, y);
    let theta = atan((y - cy) / (x - cx));
    let hs = min(200, chatchSize / 10);
    let d = random(PI / (hs + 10), PI / hs);
    noFill();

    if (cx >= x && cy >= y) {
        theta += PI;
        arc(cx, cy, r * 2, r * 2, theta - d, theta + d);
    }
    if (cx >= x && cy < y) {
        theta -= PI;
        arc(cx, cy, r * 2, r * 2, theta - d, theta + d);
    }
    if (cx < x && cy <= y) {
        arc(cx, cy, r * 2, r * 2, theta - d, theta + d);
    }
    if (cx < x && cy > y) {
        arc(cx, cy, r * 2, r * 2, theta - d, theta + d);
    }
    chatchSize += 0.05;
}

function mousePressed() {
    fArray = [];
    const numFocalPoints = 20;
    const spacingX = width / (numFocalPoints + 1);
    const spacingY = height / (numFocalPoints + 1);

    for (let i = 1; i <= numFocalPoints; i++) {
        const focalPoint = createVector(i * spacingX, i * spacingY);
        fArray.push(focalPoint);
    }

    chatchSize = 1;
}

function keyPressed() {
    hatchToggle = !hatchToggle;
}

function classicHatch() {
    let x = random(0, width);
    let y = random(0, height);
    let pixCol = bg.get(bg.width / (width / x), bg.height / (height / y));
    stroke(pixCol);
    let d = random(0, hatchSize);
    line(x - d / 2, y - d / 2, x + d / 22, y + d / 2);
}

function brightenImage(amount) {
    bg.loadPixels();
    for (let i = 0; i < bg.pixels.length; i += 4) {
        bg.pixels[i] += amount;
        bg.pixels[i + 1] += amount;
        bg.pixels[i + 2] += amount;
    }
    bg.updatePixels();
}

brightenImage(500);