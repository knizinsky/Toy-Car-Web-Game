"use strict"
import * as world from "./world.js";
import * as player from "./player.js";

let inGame = false;
let lastTime = 0;
let delta;
let startGameText = document.querySelector(".startGameText p");
world.initialize();
player.initialize();

window.addEventListener("keydown", updateInGameStatus);

function mainLoop(timeStamp) {
	delta = lastTime - timeStamp;
	world.updateVariables(delta);
	player.updateVariables(delta);
	lastTime = timeStamp
	if (player.isGameLost()){		
		inGame = false;
		startGameText.style.setProperty("display", "block")
		world.reset();
		player.reset();
	}
	window.requestAnimationFrame(mainLoop)
}


function updateInGameStatus(){
	if (inGame !== true){
		window.requestAnimationFrame(mainLoop);
		startGameText.style.setProperty("display", "none");
		inGame = true;
	}
}