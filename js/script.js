"use strict"
import * as world from "./world.js";
import * as player from "./player.js";

const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext('2d');
let inGame = false;
let lastTime = 0;
let delta;
const startGameText = document.querySelector(".startGameText p");
const endGameNote = document.querySelector(".endNote");
// const endGameButton = document.querySelector(".endNote button")
// endGameButton.addEventListener('onclick', resetGame)


world.initialize();
player.initialize()

window.addEventListener("keydown", updateInGameStatus);


function mainLoop(timeStamp) {
	delta = timeStamp - lastTime;
	ctx.fillStyle = 'white';
 	ctx.fillRect(0, 0, world.worldSize[0], world.worldSize[1]);
	world.updateVariables(delta);
	player.updateVariables(delta);
	lastTime = timeStamp
	world.draw()
	player.draw()
	if (world.isGameLost()){		
		window.alert("you lost the game")
		world.reset();
		player.reset();
		// endGameNote.style.setProperty("display", "block");
	}
	window.requestAnimationFrame(mainLoop);
}


function updateInGameStatus(){
	if (inGame !== true){
		window.requestAnimationFrame(mainLoop);
		startGameText.style.setProperty("display", "none");
		inGame = true;
	}
}

function resetGame(){
	world.reset();
	player.reset();
	endGameNote.style.setProperty("display", "none");
}