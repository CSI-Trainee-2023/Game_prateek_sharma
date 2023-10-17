const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// paddle dimensions 
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50; 
// ball dimensions 
const BALL_RADIUS = 8;
let LIFE = 3;
// background image 
const BACKGROUND = new Image;
BACKGROUND.src = "./background.jpg";

let leftArrow = false;
let rightArrow = false;



// paddle object create for ball jumping
const paddle = {
    x : cvs.width/2 - PADDLE_WIDTH/2,
    y : cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : 5
}

// function to draw the paddle 
function drawPaddle(){
     ctx.fillStyle = "red";
     ctx.fillRect(paddle.x,paddle.y,paddle.width,paddle.height);
     
     ctx.strokeStyle = "blue";
     ctx.strokeRect(paddle.x,paddle.y,paddle.width,paddle.height);
}



// control PADDLE

//function to check the key press
document.addEventListener("keydown", function(event){
    if(event.key === "ArrowLeft"){
        leftArrow = true;
    } else if(event.key === "ArrowRight"){
        rightArrow = true;
    }
    });
    
    document.addEventListener("keyup", function(event){
        if(event.key === "ArrowLeft"){
            leftArrow = false;
        } else if(event.key === "ArrowRight"){
            rightArrow = false;
        }
    });
// function to move the paddle  
    function movePaddle(){
        if(rightArrow && paddle.x + paddle.width < cvs.width){
            paddle.x += paddle.dx;
        }else if(leftArrow && paddle.x > 0){
            paddle.x -= paddle.dx;
        }
    }
    



// creating the ball object on paddle 
const ball = {
    x : cvs.width/2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : 4,
    dx : 3*(Math.random()*2-1),
    dy : -3
}

// draw the ball 
function drawBall(){
    ctx.beginPath();

    ctx.arc(ball.x,ball.y,ball.radius, 0, Math.PI*2);
    ctx.fillStyle = "yellow";
    ctx.fill();

    ctx.strokeStyle = "orange";
    ctx.stroke();

    ctx.closePath();
}

//common draw functions
function draw(){
    drawPaddle();
    drawBall();
    drawBricks();
}

// COLLISION OF BALL 

// collision of Ball with wall  
function ballWallCollision(){
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
        
    }
    if(ball.y-ball.radius < 0){
        ball.dy = -ball.dy;
    }  
    if(ball.y + ball.radius > cvs.height){
        LIFE--;
        resetBall();
    }
}
// if we lose a life then reset the position of ball 
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random()*2 - 1);
    ball.dy = -3;
}
// collision of Ball with Paddle 
function ballPaddleCollision() {
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && ball.y < paddle.y + paddle.height && ball.y > paddle.y){

        let collidePoint = ball.x - (paddle.x + paddle.width/2);

        collidePoint = collidePoint / (paddle.width/2);

        let angle = collidePoint * Math.PI/3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
        
    }
}

//  function for move the ball 
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}


// update functions 
function update(){
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
}

// BRICK CREATE 
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "purple",
    strokeColor: "pink"
}

let bricks = [];

function createBricks(){
    for(let r=0; r<brick.row; r++){
        bricks[r] = [];
        for(let c=0;c<brick.column; c++){
            bricks[r][c] = {
                x: c*(brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r*(brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}

createBricks();
// Draw the BRICKS 
function drawBricks(){
    for(let r=0; r<brick.row; r++){
        for(let c=0;c<brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);
                
                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}






// control the all functions here
function loop(){
    ctx.drawImage(BACKGROUND,0,0);
    draw();
    update();
    requestAnimationFrame(loop);
}
loop()