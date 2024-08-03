// Set up the canvas and context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Get the width and height of the window
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Function to generate a random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random RGB color
function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// Shape class (base class)
class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

// Ball class inheriting from Shape
class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true; // Tracks whether the ball exists
  }

  // Method to draw the ball on the canvas
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Method to update the ball's position
  update() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Method to detect collision with other balls
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// EvilCircle class inheriting from Shape
class EvilCircle extends Shape {
  constructor(x, y) {
    super(x, y, 20, 20); // Hardcoded velocity values for evil circle
    this.color = 'white';
    this.size = 10;

    // Event listener for controlling the evil circle with keyboard
    window.addEventListener('keydown', (e) => {
      console.log('Key pressed:', e.key); // Debugging key press
      switch (e.key) {
        case 'a':
          this.x -= this.velX;
          break;
        case 'd':
          this.x += this.velX;
          break;
        case 'w':
          this.y -= this.velY;
          break;
        case 's':
          this.y += this.velY;
          break;
      }
      console.log(`EvilCircle position after key press: (${this.x}, ${this.y})`); // Debugging position
    });

    // Event listener for controlling the evil circle with mouse
    canvas.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      console.log(`EvilCircle position after mouse move: (${this.x}, ${this.y})`); // Debugging position
    });

    console.log('Event listener added for keydown and mousemove'); // Confirming event listener setup
  }

  // Method to draw the evil circle on the canvas
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }

  // Method to check and prevent the evil circle from going out of bounds
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = width - this.size;
    }

    if ((this.x - this.size) <= 0) {
      this.x = this.size;
    }

    if ((this.y + this.size) >= height) {
      this.y = height - this.size;
    }

    if ((this.y - this.size) <= 0) {
      this.y = this.size;
    }
  }

  // Method to detect collision with balls and "eat" them
  collisionDetect() {
    for (const ball of balls) {
      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.exists = false; // Ball no longer exists
          ballCount--; // Decrement the ball count
          paragraph.textContent = `Ball count: ${ballCount}`; // Update the score
        }
      }
    }
  }
}

// Array to store the balls
const balls = [];
let ballCount = 0; // Counter for the number of balls
const paragraph = document.querySelector('p'); // Reference to the paragraph for displaying the score

// Create 25 balls and add them to the array
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
  ballCount++;
  paragraph.textContent = `Ball count: ${ballCount}`;
}

// Create the evil circle
const evilCircle = new EvilCircle(random(0, width), random(0, height));
console.log(`EvilCircle initial position: (${evilCircle.x}, ${evilCircle.y})`); // Initial position

// Main game loop
function loop() {
  // Clear the canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  // Update and draw each ball if it exists
  for (const ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  // Update and draw the evil circle
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  // Request the next animation frame
  requestAnimationFrame(loop);
}

// Start the game loop
loop();
