"use strict"
import * as world from "./world.js";
import * as player from "./player.js";

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.volume = 0.1; 

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
let inGame = false;
let gameIsPaused = false;
let isMuted = false;
let lastTime = 0;
let delta;
let score = 0;
const delta_limit = 1000
const scoreInceremnt = 0.01; 
const scoreObject = document.querySelector('.score');
const startGameText = document.querySelector(".popUp p");
const endNote = document.querySelector("#endNote");
const endNoteText = document.querySelector("#endNote p");
const pauseNote = document.getElementById("pauseNote");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const newGameButton = document.getElementById("startButton");
const muteButton = document.getElementById("muteButton");

newGameButton.addEventListener('click', startGame);
resumeButton.addEventListener('click', resumeGame)
restartButton.addEventListener('click', resetGame);
pauseButton.addEventListener('click', () => {
	if (gameIsPaused)	resumeGame();
	else				pauseGame();
})
muteButton.addEventListener('click', () => {
	if (isMuted) 	unMuteGame();
	else			muteGame();
});
document.addEventListener("keyup", (event) => {
	if(event.code === "Space") {
		event.preventDefault();
	}
});

window.onblur = pauseGame

world.initialize();
player.initialize();

function mainLoop(timeStamp) {
	if (!gameIsPaused){
		delta = timeStamp - lastTime;
		if (delta > delta_limit){
			pauseGame()
		}
		else{
			lastTime = timeStamp;
			ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, world.worldSize[0], world.worldSize[1]);
			world.updateVariables(delta, isMuted);
			player.updateVariables(delta, isMuted);
			updateScore(delta);
			world.draw();
			player.draw();
			if (world.isGameLost()){		
				endGame();
			}
			else{
				window.requestAnimationFrame(mainLoop);
			}
		}
	}
}

function startGame(){
	if (inGame !== true){
		backgroundMusic.play();
		startGameText.style.setProperty("display", "none");
		newGameButton.style.setProperty("display", "none");
		inGame = true;
		lastTime = performance.now();
		window.requestAnimationFrame(mainLoop);
	}
}

function pauseGame(){
	if (!gameIsPaused && inGame){
		backgroundMusic.pause();
		pauseNote.style.setProperty("display", "block");
		gameIsPaused = true;
	}
}

function resumeGame(){
	if (gameIsPaused && inGame){
		backgroundMusic.play()
		pauseNote.style.setProperty("display", "none");
		lastTime = performance.now();
		window.requestAnimationFrame(mainLoop);
		gameIsPaused = false;
	}
}

function endGame(){
	endNoteText.innerHTML = "You lost! your score is " + parseInt(score);
	endNote.style.setProperty("display", "block");
	backgroundMusic.pause();
	inGame = false;
}

function resetGame(){
	backgroundMusic.play();
	world.reset();
	player.reset();
	endNote.style.setProperty("display", "none");
	lastTime = performance.now(); 
	window.requestAnimationFrame(mainLoop);
	score = 0;
	inGame = true;
}

function muteGame(){
	backgroundMusic.muted = true;
	isMuted = true;
}

function unMuteGame(){
	backgroundMusic.muted = false;
	isMuted = false;
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