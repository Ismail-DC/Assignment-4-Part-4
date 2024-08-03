// Get reference to the canvas element
const canvas = document.querySelector("canvas");

// Set canvas dimensions to match the viewport
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Generate a random integer between min and max, inclusive
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random RGB color string
function randomRGB() {
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;        // X-coordinate
        this.y = y;        // Y-coordinate
        this.velX = velX;  // Horizontal velocity
        this.velY = velY;  // Vertical velocity
        this.color = color;// Ball color
        this.size = size;  // Ball radius
    }

    // Draw the ball on the canvas
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Update ball position and handle wall collisions
    update() {
        if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
            this.velX = -this.velX;
        }

        if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
            this.velY = -this.velY;
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    // Check for collisions with other balls
    collisionDetect() {
        for (const ball of balls) {
            if (this !== ball) {  // Avoid self-collision
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {
                    this.color = ball.color = randomRGB(); // Change color on collision
                }
            }
        }
    }
}

// Array to hold all balls
const balls = [];

// Create 25 balls with random properties
while (balls.length < 25) {
    const size = random(10, 20);
    const ball = new Ball(
        random(size, width - size),
        random(size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
    );

    balls.push(ball);
}

// Animation loop function
function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    }

    requestAnimationFrame(loop); // Continue animation
}

// Start the animation
loop();