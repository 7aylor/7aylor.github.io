function update(){
    tick++;
    player.updateSprite();
    //drawMap();
}

function setPlayerInput(){
    document.addEventListener("keydown", movePlayer);
}

function movePlayer(evt){
    if(evt.keyCode == UP_ARROW){
        player.move(player.tileX, player.tileY - 1);
    }
    if(evt.keyCode == LEFT_ARROW){
        player.move(player.tileX - 1, player.tileY);
    }
    if(evt.keyCode == DOWN_ARROW){
        player.move(player.tileX, player.tileY + 1);
    }
    if(evt.keyCode == RIGHT_ARROW){
        player.move(player.tileX + 1, player.tileY);
    }
}