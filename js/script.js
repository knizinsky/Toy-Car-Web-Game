"use strict"
import * as world from "./world.js";
import * as player from "./player.js";

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
let inGame = false;
let lastTime = 0;
let delta;
let score = 0;
const scoreInceremnt = 0.01; 
const scoreObject = document.querySelector('.score');
const startGameText = document.querySelector(".startGameText p");
const endNote = document.querySelector(".endNote");
const endNoteText = document.querySelector(".endNote p");
const endGameButton = document.querySelector(".endNote button");
const newGameButton = document.querySelector('.start-button');
endGameButton.addEventListener('click', resetGame);
newGameButton.addEventListener('click',updateInGameStatus);

world.initialize();
player.initialize();

window.addEventListener("keydown", updateInGameStatus);


function mainLoop(timeStamp) {
	delta = timeStamp - lastTime;
	lastTime = timeStamp;
	ctx.fillStyle = 'white';
 	ctx.fillRect(0, 0, world.worldSize[0], world.worldSize[1]);
	world.updateVariables(delta);
	player.updateVariables(delta);
	updateScore(delta);
	world.draw();
	player.draw();
	if (world.isGameLost()){		
		endNoteText.innerHTML = "You lost! your score is " + parseInt(score);
		endNote.style.setProperty("display", "block");
	}
	else{
		window.requestAnimationFrame(mainLoop);
	}
}


function updateInGameStatus(){
	if (inGame !== true){
		startGameText.style.setProperty("display", "none");
		newGameButton.style.setProperty("display", "none");
		inGame = true;
		lastTime = performance.now();
		window.requestAnimationFrame(mainLoop);
	}
}

function resetGame(){
	world.reset();
	player.reset();
	endNote.style.setProperty("display", "none");
	lastTime = performance.now(); 
	window.requestAnimationFrame(mainLoop);
	score = 0;
}

function updateScore(delta){
	score += scoreInceremnt * delta * world.currWorldSpeedRate;
    scoreObject.innerHTML = to6DigitStr(parseInt(score));
}

function to6DigitStr(number){
    if (number > 0){
        let n = number;
        let c = 0;
        while (n/100000 < 1){
            c += 1;
            n *= 10;
        }
        return '0'.repeat(c) + String(number);
    }
    return '0'.repeat(6);
}