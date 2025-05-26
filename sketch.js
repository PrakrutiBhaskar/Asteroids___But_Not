let squareSize = 30;  // Size of the square (spaceship)
let squareX, squareY, total = 0;  // Position of the spaceship, total score
let xspeed = 0, yspeed = 0; // Movement speed of the spaceship
let bulletList = [];  // List of bullets
let circleList = [];  // List of asteroids
let lastTime = 0;  // Last time an asteroid was created
let delay = 3500;  // Delay between asteroid creation
let bulletSpeed = 5;  // Bullet speed

function setup() {
  createCanvas(windowWidth, windowHeight);
  squareX = width / 2 - squareSize / 2;  // Center the spaceship horizontally
  squareY = height - squareSize - 10;  // Position spaceship near the bottom
  frameRate(50);  // Set the frame rate to 50 for smoother movement
}

function draw() {
  background(0);

  // Display the square (spaceship)
  fill(255);
  noStroke();
  rect(squareX, squareY, squareSize);

  // Update and draw bullets
  for (let i = bulletList.length - 1; i >= 0; i--) {
    let b = bulletList[i];
    b.update();
    b.draw();

    // Remove bullet if it goes off the screen
    if (b.y < 0) {
      bulletList.splice(i, 1);
    }
  }

  // Update and draw asteroids
  astroid();

  // Update spaceship position based on speed
  squareX += xspeed * 5;
  squareY += yspeed * 5;

  // Constrain spaceship within the canvas bounds
  squareX = constrain(squareX, 0, width - squareSize);
  squareY = constrain(squareY, 0, height - squareSize);
}

// Asteroids creation and movement
function astroid() {
  if (millis() - lastTime > delay) {
    // Add a new asteroid to the list
    circleList.push({
      x: random(width),
      y: random(0, (3 / 4) * height),
      r: random(10, 50),
    });
    lastTime = millis();
  }

  // Draw all asteroids in the list
  for (let i = circleList.length - 1; i >= 0; i--) {
    let c = circleList[i];
    fill(100);
    ellipse(c.x, c.y, c.r * 2, c.r * 2);  // Draw asteroid

    // Check for collision with bullets
    for (let j = 0; j < bulletList.length; j++) {
      let b = bulletList[j];
      let d = dist(c.x, c.y, b.x, b.y);  // Distance between asteroid and bullet
      if (d < c.r + b.r) {  // If collision occurs
        total += 10;  // Increase score
        circleList.splice(i, 1);  // Remove the asteroid
        bulletList.splice(j, 1);  // Remove the bullet
        break;  // Exit the loop once the asteroid is destroyed
      }
    }

    // Check for collision with spaceship
    if (checkCollision(c)) {
      // Display the game over message with score
      let centerX = width / 2;
      let centerY = height / 2;
      background(0);
      fill(255);
      textFont('Courier New');
      textSize(40);
      textAlign(CENTER);
      text("Collision Detected!", centerX, centerY - 200);
      textStyle(BOLD);
      text("GAME OVER!", centerX, centerY - 100);
      text("POINTS SCORED : ", centerX, centerY);
      text(total, centerX + 200, centerY);  // Display score

      noLoop();  // Stop the game if collision happens
    }
  }
}

// Function to check if the spaceship (square) touches the asteroid (circle)
function checkCollision(asteroid) {
  let closestX = constrain(asteroid.x, squareX, squareX + squareSize);
  let closestY = constrain(asteroid.y, squareY, squareY + squareSize);
  
  // Calculate the distance between the asteroid's center and the closest point on the square
  let distance = dist(asteroid.x, asteroid.y, closestX, closestY);
  
  // If the distance is less than the radius of the asteroid, there is a collision
  return distance < asteroid.r;
}

// Bullet class to manage the bullet's movement
function Bullet(x, y, r) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.speed = bulletSpeed;

  this.update = function () {
    this.y -= this.speed;  // Move the bullet up
  };

  this.draw = function () {
    fill(255, 215, 0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  };
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    xspeed = 1;
  } else if (keyCode === LEFT_ARROW) {
    xspeed = -1;
  } else if (keyCode === UP_ARROW) {
    yspeed = -1;
  } else if (keyCode === DOWN_ARROW) {
    yspeed = 1;
  }

  // Fire a bullet when the spacebar is pressed
  if (key === " ") {
    let x = squareX + squareSize / 2;  // Bullet starts from the center of the square
    let y = squareY;
    bulletList.push(new Bullet(x, y, 5));  // Create a new bullet
  }
}

function keyReleased() {
  // Stop movement when key is released
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    xspeed = 0;
  } else if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    yspeed = 0;
  }
}
