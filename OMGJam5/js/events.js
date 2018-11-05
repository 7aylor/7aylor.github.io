function setPlayerInput(){
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", () => {keyDown = false;});
    pressR = document.addEventListener("keydown", reset);
}

function movePlayer(evt){
    
    if(keyDown == false){
        if(evt.keyCode == UP_ARROW){
            player.move(player.tileX, player.tileY - 1, directions.up);
        }
        if(evt.keyCode == LEFT_ARROW){
            player.move(player.tileX - 1, player.tileY, directions.left);
        }
        if(evt.keyCode == DOWN_ARROW){
            player.move(player.tileX, player.tileY + 1, directions.down);
        }
        if(evt.keyCode == RIGHT_ARROW){
            player.move(player.tileX + 1, player.tileY, directions.right);
        }
    }
    
    keyDown = true;
}

function anyKey(){
    anyKeyPressed = document.addEventListener("keydown", loadNextLevel);
}

function loadNextLevel(evt){
    clearInterval(startAnimsInterval);
    startCaveman = null;
    startFires = null;
    if(anyKeyPressed || beginning){
        console.log("load");
        level++;
        startGame();
        anyKeyPressed = false;
        beginning = false;
    }
}

function reset(evt){
    if(evt.keyCode == R){
        loadLevel(level);
    }
}