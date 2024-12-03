const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// Resize canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const matrix = letters.split("");

const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function draw() {
  // Slightly transparent background for fading effect
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < drops.length; i++) {
    const text = matrix[Math.floor(Math.random() * matrix.length)];

    // Randomly choose between green and red color
    const isRed = Math.random() < 0.1; // 10% chance for red
    ctx.fillStyle = isRed ? "#ff0000" : "#0f0";

    ctx.font = fontSize + "px monospace";
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    // Reset drop to the top with some randomness
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

// Refresh animation
setInterval(draw, 33);

// Update canvas size when window resizes
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
