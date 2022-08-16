let currWorldSpeedRate = 1;     //all variables are in  per milisecond units

const speedIncrement = 0.001;

export function initialize() {}

export function updateVariables(delta) {}

export function reset () {}


function addObsticle() {}

function addCloud() {}

function moveClouds() {}

function moveObsticles() {}


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