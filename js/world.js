import * as player from "./player.js" 
import { drawPolygon } from "./debug.js";

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
const title = document.querySelector('header .title');

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
        let drawOffset = obsticleDrawOffset[name];
        super([worldSize[0] + obsticleData[name][2], groundLevel - obsticleData[name][3] - drawOffset],
            obsticleData[name][2], obsticleData[name][3], obsticleData[name][4], obsticleData[name][5], 
            null, images[name])
        this.collisionVertices = obsticleData[name][0];
    }

    updateVariables(delta){
        super.updateAnimation(delta);
        let dist = - delta * currWorldSpeedRate;
        this.position[0] += dist;
    }

    // debug only
    draw(){
        super.draw(this.drawOffset);
        drawPolygon(ctx, this.position, this.collisionVertices);
    }
}


class railObject extends player.sprite{
    constructor(position, imgSrc, imgWidth, imgHeight, frameCount, frameHold){
        super(position, imgSrc, imgWidth, imgHeight, frameCount, frameHold)
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

let isMuted = false;
const speedRandomMargin = 0.01;
const groundLevel = 530;
const skylevel = [20, 60]
const origWorldSpeedRate = 0.55;
export let currWorldSpeedRate = origWorldSpeedRate;     //all variables are in  per milisecond units
const speedIncrement = 0.00005;
const randomRangeModifier = 0.06 ;
const world = document.querySelector(".world");
export const worldSize = [1920, 600];
export let currScale = 1;                               // for placing and moving obejcts

const obsticles = new Set();
const clouds = new Set();           
const images = {};               // name : image

const rails = new railObject([0, 460], 191, 80, 1, 10, "./img/rails3d.png");
const background = new railObject([0, 340], 4820, 262, 1, 10, "./img/background.png");
const crashSound = new Audio("./audio/crashSound.mp3");
crashSound.volume = 0.5;
const fartSound = new Audio("./audio/endFart.wav");
fartSound.volume = 1;

const cloudData = {};            //speed(int(1,10)), imgSrc, imgWidth, imgHeight, frameCount, frameHold
cloudData['cloud0'] = [0.3, "./img/cloud0.png", 202, 103, 1, 5];
cloudData['cloud1'] = [0.3, "./img/cloud1.png", 202, 103, 1, 5];
cloudData['cloud2'] = [0.2, "./img/cloud2.png", 250, 107, 1, 5];
cloudData['cloud3'] = [0.3, "./img/cloud3.png", 192, 88, 1, 5];
cloudData['cloud4'] = [0.2, "./img/cloud4.png", 192, 88, 1, 5];
cloudData['cloud5'] = [0.2, "./img/cloud5.png", 192, 109, 1, 5];
cloudData['cloud6'] = [0.2, "./img/cloud6.png", 252, 119, 1, 5];
cloudData['cloud7'] = [0.2, "./img/cloud7.png", 160, 67, 1, 5];
cloudData['cloud8'] = [0.2, "./img/cloud8.png", 139, 63, 1, 5];

// const cloudSpawnFreq = [[3, 'cloud0'], [6, 'cloud1'], [10, 'cloud2']];
// const cloudSpawnFreq = [[3, 'cloud3'], [6, 'cloud4']];
const cloudSpawnFreq = [[3, 'cloud5'], [6, 'cloud6'], [10, 'cloud7'], [14, 'cloud8']];
const origCloudDeltaRange = [1500, 6000]; 
let cloudDeltaRange = [...origCloudDeltaRange];
let cloudDelta = myRandom(...cloudDeltaRange);

const obsticleData = {};        //collisionRect, imgSrc, imgWidth, imgHeight, frameCount, frameHold
obsticleData['monkey'] = [[[73, 12], [0, 132], [8, 188], [108, 188], [155, 144]], "./img/monkey4.png", 161, 192, 1, 60];
obsticleData['suicider'] = [[[73, 23], [5, 80], [17, 107], [53, 106], [122, 42]], "./img/suicider3.png", 132, 110, 1, 60];
const obsticleDrawOffset = {};
obsticleDrawOffset['suicider'] = -13;
obsticleDrawOffset['monkey'] = 0;
const obsticleSpawnFreq = [[5, 'monkey'], [10, 'suicider']]
const origObsticleDeltaRange = [1000, 5000]; 
let obsticleDeltaRange = [...origObsticleDeltaRange];
let obsticleDelta = 500;


export function initialize() {
    resizeWindow();
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

export function updateVariables(delta, muted) {
    isMuted = muted;
    currWorldSpeedRate += speedIncrement;
    if (cloudDeltaRange[1] - cloudDeltaRange[0] < 200){
        cloudDeltaRange[0] -= randomRangeModifier * delta / 10;
    }
    else{
        cloudDeltaRange[1] -= randomRangeModifier * delta / 2;
    }

    if (obsticleDeltaRange[1] - obsticleDeltaRange[0] < 200){
        obsticleDeltaRange[0] -= randomRangeModifier * delta / 5;
    } 
    else{
        obsticleDeltaRange[1] -= randomRangeModifier * delta;
    }

    cloudDelta -= delta;
    if (cloudDelta <= 0){
        addCloud();
    }
    obsticleDelta -= delta;
    if (obsticleDelta <= 0){
        addObsticle();
    }

    moveRailObject(delta, rails);
    moveRailObject(delta, background);
    moveClouds(delta);
    moveObsticles(delta);
}

export function draw(){
    background.draw()
    rails.draw()
    for (let cloud of clouds){
        cloud.draw();
    }
    for (let obsticle of obsticles){
        obsticle.draw();
    }
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
    const playerPolygon = getWorldPolygon(player.player.position, player.player.collisionVertices);
    for (let obsticle of obsticles){
        const obsticlePolygon = getWorldPolygon(obsticle.position, obsticle.collisionVertices);
        if (collidePolygon(playerPolygon, obsticlePolygon)){
            fartSound.play();
            if (!isMuted){
                crashSound.play();
            } 
            return true;
        }
    }
    return false;
}

function addObsticle() {
    let number = myRandom(0, obsticleSpawnFreq[obsticleSpawnFreq.length-1][0]);
    let name = ceilBinSearch(obsticleSpawnFreq, number, 0, obsticleSpawnFreq.length);
    obsticles.add(new obsticleObject(name));
    obsticleDelta = myRandom(...obsticleDeltaRange);
}

function addCloud() {
    let number = myRandom(0, cloudSpawnFreq[cloudSpawnFreq.length-1][0]);
    let name = ceilBinSearch(cloudSpawnFreq, number, 0, cloudSpawnFreq.length);
    clouds.add(new cloudObject(name));
    cloudDelta = myRandom(...cloudDeltaRange);
    
}

function moveRailObject(delta, object) {
    object.position[0] -= currWorldSpeedRate * delta;
    if (object.position[0] <= -object.frameWidth){
        object.position[0] += object.frameWidth;
    }
}

function moveClouds(delta) {
    for (let cloud of clouds){
        cloud.updateVariables(delta);
        if (cloud.position[0] <= -cloud.frameWidth){
            clouds.delete(cloud);
        }
    }
}

function moveObsticles(delta) {
    for (let obsticle of obsticles){
        obsticle.updateVariables(delta);
        if (obsticle.position[0] <= -obsticle.frameWidth){
            obsticles.delete(obsticle);
        }
    }
}

function resizeWindow(){
    let width;
    let titleHeight = parseInt(getComputedStyle(title).getPropertyValue("height"));
    let dimRatio = worldSize[0] / worldSize[1];
    if (window.innerWidth / (window.innerHeight - titleHeight) > dimRatio){
        width = dimRatio * (window.innerHeight - titleHeight);
        world.style.setProperty("--width", `${width}px`);
        world.style.setProperty("--height", `${window.innerHeight - titleHeight}px`);
    }
    else{
        width = window.innerWidth;
        world.style.setProperty("--width", `${width}px`);
        world.style.setProperty("--height", `${1/dimRatio * window.innerWidth}px`);
    }
    currScale = width / worldSize[0];
}

// temporrary function
function getRectVertices(rect){
    const vertices = [];
    vertices[0] = [rect[0], rect[1]];
    vertices[1] = [rect[0], rect[1] + rect[3]];
    vertices[2] = [rect[0] + rect[2], rect[1] + rect[3]];
    vertices[3] = [rect[0] + rect[2], rect[1]];
    return vertices;
}

function collidePolygon(p1, p2){
    let edgeData1 = getEdgeData(p1);            // [point, vector]
    for (let data of edgeData1){
        if (!checkCollisionAxis(p1, p2, ...data)){
            return false;
        }
    }
    let edgeData2 = getEdgeData(p2);            // [point, vector]
    for (let data of edgeData2){
        if (!checkCollisionAxis(p1, p2, ...data)){
            return false;
        }
    }
    return true;
}

function checkCollisionAxis(p1, p2, point, vector){
    const normal = [-vector[1], vector[0]];
    const vectors1 = getVectors(point, p1)
    const vectors2 = getVectors(point, p2)
    const span1 = getShapeSpan(vectors1, normal);
    const span2 = getShapeSpan(vectors2, normal);
    if (span1[1] < span2[0] || span2[1] < span1[0]){
        return false;
    }
    return true;
}

function getShapeSpan(edges, normal){
    let span = [Infinity, -Infinity];
    for (let edge of edges){
        let dp = dotProduct(edge, normal);
        span[0] = Math.min(span[0], dp);
        span[1] = Math.max(span[1], dp);
    }
    return span
}  

function getWorldPolygon(pos, vertices){
    return vertices.map((x) => [x[0] + pos[0], x[1] + pos[1]]);
}

function getEdgeData(polygon){
    const data = [];            // [point, vector]
    let i, j;
    for (i = 0, j = polygon.length-1; i < polygon.length; j = i++){
        data[i] = [[...polygon[i]], [polygon[i][0] - polygon[j][0], polygon[i][1] - polygon[j][1]]];
    }
    return data;
}

function getVectors(start, ends){
    const vectors = [];
    for (let i = 0; i < ends.length; i++){
        vectors[i] = [ends[i][0] - start[0], ends[i][1] - start[1]]
    }
    return vectors
}

function dotProduct(vec1, vec2){
    if (vec1.length !== vec2.length){
        return null;
    }
    let sum = 0;
    for(let i = 0; i < vec1.length; i++){
        sum += vec1[i] * vec2[i];
    }
    return sum;
}

function myRandom(start, end){
    return Math.floor(Math.random() * end) + start;
}
/**
 * @name myRandom
 * @description generates random int from given range excluding end 
 * @param {int} start 
 * @param {int} end 
 * 
 * @returns {int} 
 */

function ceilBinSearch(seqence, number, start, end) {
    if (end - start > 1){
        let pivot = Math.floor(start + end / 2);
        if (number === seqence[pivot][0]){
            return seqence[pivot][1];
        }
        else if (number > seqence[pivot][0]){
            return ceilBinSearch(seqence, number, pivot + 1, end);
        }
        else{
            if (number > seqence[pivot - 1][0]){
                return seqence[pivot][1];
            }
            return ceilBinSearch(seqence, number, start, pivot);
        }
    }
    return seqence[start][1];
}