const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
const gravity = 0.03;
const jumpForce = -8;
const maxJumpCount = 2;


export function initialize() {
    document.addEventListener('keydown', (event) => {
        if (event.code === "Space"){
            player.jump()
        }
    })
}

export function updateVariables(delta) {
    player.updateVariables(delta)
}

export function draw(currScale){
    player.draw(currScale)
}


export function reset () {
    player.reset()
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
            parseInt(this.frameWidth ), parseInt(this.frameHeight))
    }

}

class playerObject extends sprite{
    constructor(collisionRect, position, imgSrc, imgWidth, imgHeight, frameCount, frameHold){
        super(position, imgWidth, imgHeight, frameCount, frameHold, imgSrc);
        this.startPosition = [...position];
        this.rect = collisionRect;
        this.yVelocity = 0; 
        this.jumpsLeft = maxJumpCount;
        this.jumping = false;
    }

    jump() {
        if (this.jumpsLeft > 0){
            this.jumping = true;
            this.yVelocity = jumpForce;
            this.jumpsLeft -= 1;
        }
    }

    updateVariables(delta) {
        this.updateAnimation(delta)
        if (this.jumping){
            this.position[1] += this.yVelocity;
            this.yVelocity += gravity * delta;
            if (this.position[1] > this.startPosition[1]){
                this.position[1] = this.startPosition[1];
                this.jumpsLeft = maxJumpCount
                this.yVelocity = 0;
                this.jumping = false;
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
}

export const player = new playerObject([0, 0, 217, 151], [30, 380], "../img/zabawka-autko.png", 217, 151, 1, 5); 