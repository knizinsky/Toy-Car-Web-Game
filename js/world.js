import * as player from "./player.js" 
const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
const title = document.querySelector('header .title')

class cloudObject extends player.sprite{
    constructor(name) {
        super([worldSize[0] + cloudData[name][2], myRandom(...skylevel)],
            cloudData[name][2], cloudData[name][3], cloudData[name][4], cloudData[name][5], 
            null, images[name])

        this.speed = myRandom(cloudData[name][0] - speedRandomMargin, cloudData[name][0] + speedRandomMargin);
        this.image = images[name];
    }

    updateVariables(delta){
        super.updateAnimation(delta);
        let dist = - delta * this.speed;
        this.position[0] += dist;
    }
}

class obsticleObject extends player.sprite{
    constructor(name) {
        super([worldSize[0] + obsticleData[name][2], groundLevel - obsticleData[name][3]],
            obsticleData[name][2], obsticleData[name][3], obsticleData[name][4], obsticleData[name][5], 
            null, images[name])
        this.rect = obsticleData[name][0]
    }

    updateVariables(delta){
        super.updateAnimation(delta);
        let dist = - delta * currWorldSpeedRate;
        this.position[0] += dist;
    }
}

class railObject extends player.sprite{
    constructor(){
        super([0, 460], 198, 80, 1, 10, '../img/rails.png')
    }

    updateVariables(delta){
        let dist = - delta * currWorldSpeedRate;
        this.position[0] += dist;
    }

    draw(){
        let pos = [this.position[0], this.position[1]];
        while (pos[0] <= worldSize[0]){
            ctx.drawImage(this.image, 
                0, 0, this.frameWidth, this.frameHeight,
                pos[0], pos[1], this.frameWidth, this.frameHeight)
            pos[0] += this.frameWidth;
        }
    }
}


const speedRandomMargin = 0.01
const groundLevel = 500;
const skylevel = [20, 100]
const origWorldSpeedRate = 0.4;
let currWorldSpeedRate = origWorldSpeedRate;     //all variables are in  per milisecond units
const speedIncrement = 0.00005;
const randomRangeModifier = 0.005;
const world = document.querySelector(".world");
export const worldSize = [1920, 600];
export let currScale = 1;              // for placing and moving obejcts

const obsticles = new Set();
const clouds = new Set();           
const images = {}               // name : image

const rails = new railObject();


const cloudData = {}            //speed(int(1,10)), imgSrc, imgWidth, imgHeight, frameCount, frameHold
cloudData['cloud1'] = [0.3, '../img/cloud1.png', 192, 88, 1, 5];
cloudData['cloud2'] = [0.2, '../img/cloud2.png', 192, 88, 1, 5];
const cloudSpawnFreq = [[3, 'cloud1'], [8, 'cloud2']]
const origCloudDeltaRange = [100, 5000]; 
let cloudDeltaRange = [...origCloudDeltaRange];
let cloudDelta = myRandom(...cloudDeltaRange);

const obsticleData = {};        //collisionRect, imgSrc, imgWidth, imgHeight, frameCount, frameHold
obsticleData['obsticle1'] = [[0, 0, 50, 100],'../img/obsticle1.png', 50, 100, 1, 5];
const obsticleSpawnFreq = [[4, 'obsticle1']]
const origObsticleDeltaRange = [1000, 8000]; 
let obsticleDeltaRange = [...origObsticleDeltaRange];
let obsticleDelta = 500;


export function initialize() {
    resizeWindow()
    window.addEventListener("resize", resizeWindow)

    for (let key in obsticleData) {         // filling up images
        images[key] = new Image();
        images[key].src = obsticleData[key][1];
    }
    for (let key in cloudData) {
        images[key] = new Image();
        images[key].src = cloudData[key][1];
    }



}

export function updateVariables(delta) {
    currWorldSpeedRate += speedIncrement;
    // cloudDeltaRange[0] -= randomRangeModifier;
    cloudDeltaRange[1] -= randomRangeModifier;
    // obsticleDeltaRange[0] -= randomRangeModifier;
    obsticleDeltaRange[1] -= randomRangeModifier;

    cloudDelta -= delta;
    if (cloudDelta <= 0){
        addCloud()
    }
    obsticleDelta -= delta;
    if (obsticleDelta <= 0){
        addObsticle()
    }

    moveRails(delta)
    moveClouds(delta)
    moveObsticles(delta)
}

export function draw(){
    for (let cloud of clouds){
        cloud.draw();
    }
    for (let obsticle of obsticles){
        obsticle.draw();
    }
    rails.draw()
}

export function reset () {
    cloudDeltaRange[0] = origCloudDeltaRange[0];
    cloudDeltaRange[1] = origCloudDeltaRange[1];
    obsticleDeltaRange[0] = origObsticleDeltaRange[0];
    obsticleDeltaRange[1] = origObsticleDeltaRange[1];
    obsticleDelta = myRandom(...obsticleDeltaRange);
    cloudDelta = myRandom(...cloudDeltaRange);
    currWorldSpeedRate = origWorldSpeedRate;

    clouds.clear();
    obsticles.clear();
}

export function isGameLost() {
    for (let obsticle of obsticles)
        return collideRect( [player.player.rect[0] + player.player.position[0], 
                player.player.rect[1] + player.player.position[1], player.player.rect[2], player.player.rect[3]],
            [obsticle.position[0] + obsticle.rect[0], obsticle.position[1] + obsticle.rect[1],
            obsticle.rect[2], obsticle.rect[3]])

}

function addObsticle() {
    let number = myRandom(0, obsticleSpawnFreq[obsticleSpawnFreq.length-1][0]);
    let name = floorBinSearch(obsticleSpawnFreq, number, 0, obsticleSpawnFreq.length);
    obsticles.add(new obsticleObject(name))
    obsticleDelta = myRandom(...obsticleDeltaRange)
}

function addCloud() {
    let number = myRandom(0, cloudSpawnFreq[cloudSpawnFreq.length-1][0]);
    let name = floorBinSearch(cloudSpawnFreq, number, 0, cloudSpawnFreq.length);
    clouds.add(new cloudObject(name))
    cloudDelta = myRandom(...cloudDeltaRange)
    
}

function moveRails(delta) {
    rails.position[0] -= currWorldSpeedRate * delta;
    if (rails.position[0] <= -rails.frameWidth){
        rails.position[0] += rails.frameWidth;
    }
}

function moveClouds(delta) {
    for (let cloud of clouds){
        cloud.updateVariables(delta)
        if (cloud.position[0] <= -cloud.frameWidth){
            clouds.delete(cloud);
        }
    }
}

function moveObsticles(delta) {
    for (let obsticle of obsticles){
        obsticle.updateVariables(delta)
        if (obsticle.position[0] <= -obsticle.frameWidth){
            obsticles.delete(obsticle);
        }
    }
}

function resizeWindow(){
    let width;
    let titleHeight = parseInt(getComputedStyle(title).getPropertyValue("height"))
    let dimRatio = worldSize[0] / worldSize[1];
    if (window.innerWidth / (window.innerHeight - titleHeight) > dimRatio){
        width = dimRatio * (window.innerHeight - titleHeight);
        world.style.setProperty("--width", `${width}px`)
        world.style.setProperty("--height", `${window.innerHeight - titleHeight}px`)
    }
    else{
        width = window.innerWidth;
        world.style.setProperty("--width", `${width}px`)
        world.style.setProperty("--height", `${1/dimRatio * window.innerWidth}px`)
    }
    currScale = width / worldSize[0];
}

function collideRect(rect1, rect2){
    return rect1[0] < rect2[0] + rect2[2] &&
        rect1[0] + rect1[2] > rect2[0] &&
        rect1[1] < rect2[1] + rect2[3] &&
        rect1[1] + rect1[3] > rect2[1]
}

function myRandom(start, end){
    return Math.floor(Math.random() * end) + start
}
/**
 * @name myRandom
 * @description generates random int from given range excluding end 
 * @param {int} start 
 * @param {int} end 
 * 
 * @returns {int} 
 */

function floorBinSearch(seqence, number, start, end) {
    if (end - start > 1){
        let pivot = Math.floor(start + end / 2)
        if (number === seqence[pivot][0]){
            return seqence[pivot][1]
        }
        else if (number < seqence[pivot][0]){
            
            return floorBinSearch(seqence, number, start, pivot - 1)
        }
        else{
            // if (seqence.length === pivot + 1 || seqence[pivot+1][0] > number){
            //     return seqence[pivot][1]
            // }
            return floorBinSearch(seqence, number, pivot + 1, end)
        }
    }
    return seqence[start][1]
}


