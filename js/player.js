import { drawPolygon } from "./debug.js";

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
const gravity = 0.007;
const jumpForce = -1.6;
const maxJumpCount = 2;


export function initialize() {
    document.addEventListener('keydown', (event) => {
        if (event.code === "Space"){
            player.jump();
        }
    })
    document.addEventListener('touchstart', () => {
            player.jump();
    })
}

export function updateVariables(delta, isMuted) {
    player.updateVariables(delta, isMuted);
}

export function draw(currScale){
    player.draw(currScale);
}

export function reset () {
    player.reset();
}

export class sprite{
    constructor(position, imgWidth, imgHeight, frameCount, frameHold, imgSrc = null, img = null) {
        this.position = position; 
        if (img == null){
            this.image = new Image();
            this.image.src = imgSrc;
        }
        else{
            this.image = img;
        }
        this.frameWidth = imgWidth / frameCount;
        this.frameHeight = imgHeight;
        this.frameHold = frameHold;         // time in ms that specific frame will be visible on screen
        this.frameCount = frameCount;
        this.frameIndex = 0;                // index of curr frame
        this.currDelta = 0;
        this.isMuted = false;
    }

    updateAnimation(delta) {
        if (this.currDelta >= this.frameHold){
            this.currDelta = 0;
            this.frameIndex = (this.frameIndex + 1) % this.frameCount;
        }
        else{
            this.currDelta += delta;
        }
    }

    draw() {
        ctx.drawImage(this.image, 0, 0, this.frameWidth, this.frameHeight,
            parseInt(this.position[0]), parseInt(this.position[1]), 
            parseInt(this.frameWidth ), parseInt(this.frameHeight));
    }
}

class playerObject extends sprite{
    constructor(collisionVertices, position, imgSrc, imgWidth, imgHeight, frameCount, frameHold){
        super(position, imgWidth, imgHeight, frameCount, frameHold, imgSrc);
        this.startPosition = [...position];
        this.collisionVertices = collisionVertices
        this.yVelocity = 0; 
        this.jumpsLeft = maxJumpCount;
        this.jumping = false;
        this.jumpSound = new Audio('./audio/jumpSound.mp3');
        this.jumpSound.volume = 0.3;
        this.doubleJumpSound = new Audio('./audio/jumpSound.mp3');
        this.doubleJumpSound.volume = 0.3;
        this.landingSound = new Audio('./audio/landingSound.mp3');
        this.landingSound.volume = 0.5;
    }

    jump() {
        if (this.jumpsLeft > 0){
            this.jumping = true;
            this.yVelocity = jumpForce;
            if (!this.isMuted){
                if (this.jumpsLeft === 2){
                    this.jumpSound.play();
                }
                else{
                    this.doubleJumpSound.play();
                }
            }
            this.jumpsLeft -= 1;
        }
    }

    updateVariables(delta, isMuted) {
        this.isMuted = isMuted;
        this.updateAnimation(delta)
        if (this.jumping){
            this.position[1] += this.yVelocity * delta;
            this.yVelocity += gravity * delta;
            if (this.position[1] > this.startPosition[1]){
                this.position[1] = this.startPosition[1];
                this.jumpsLeft = maxJumpCount
                this.yVelocity = 0;
                this.jumping = false;
                if (!this.isMuted){
                    this.landingSound.play();
                }
            } 
        }
    }
    reset() {
        this.position = [...this.startPosition]; 
        this.frameIndex = 0;
        this.currTicks = 0;
        this.yVelocity = 0; 
        this.jumpsLeft = maxJumpCount;
        this.jumping = false;
    }

    // debug only
    draw(){
        super.draw();
        drawPolygon(ctx, this.position, this.collisionVertices);
    }
}

export const player = new playerObject([[5, 140], [170, 140], [215, 100],  [215, 15]], [30, 380], "./img/zabawka-autko.png", 217, 151, 1, 5); 