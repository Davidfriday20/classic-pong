const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const paddleHeight = 100;
const paddleWidth = 10;

let playerY = (canvas.height - paddleHeight) / 2;
let computerY = (canvas.height - paddleHeight) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let playerScore = 0;
let computerScore = 0;

let wPressed = false;
let sPressed = false;

document.addEventListener("keydown", e => {
    if (e.key === "w" || e.key === "W") wPressed = true;
    if (e.key === "s" || e.key === "S") sPressed = true;
});

document.addEventListener("keyup", e => {
    if (e.key === "w" || e.key === "W") wPressed = false;
    if (e.key === "s" || e.key === "S") sPressed = false;
});

function draw() {
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Middle dashed line
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = "white";
    ctx.fillRect(10, playerY, paddleWidth, paddleHeight);                    // Player
    ctx.fillRect(canvas.width - 20, computerY, paddleWidth, paddleHeight);   // Computer

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
    ctx.fill();

    // Scores
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText(playerScore, canvas.width / 4, 70);
    ctx.fillText(computerScore, 3 * canvas.width / 4, 70);
}

function update() {
    // Player movement
    if (wPressed && playerY > 0) playerY -= 8;
    if (sPressed && playerY < canvas.height - paddleHeight) playerY += 8;

    // Simple AI
    if (computerY + paddleHeight / 2 < ballY) computerY += 6;
    else if (computerY + paddleHeight / 2 > ballY) computerY -= 6;

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom collision
    if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

    // Paddle collision
    if (ballX <= 25 && ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX *= -1.05;
    }
    if (ballX >= canvas.width - 25 && ballY > computerY && ballY < computerY + paddleHeight) {
        ballSpeedX *= -1.05;
    }

    // Scoring
    if (ballX < 0) {
        computerScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = (Math.random() > 0.5 ? 5 : -5);
    ballSpeedY = (Math.random() * 6) - 3;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

resetBall();
gameLoop();
