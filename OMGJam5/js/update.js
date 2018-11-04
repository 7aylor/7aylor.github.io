function update(){
    tick++;
    player.updateSprite();
    if(fire != null){fire.updateSprite();}
}

function setPlayerInput(){
    document.addEventListener("keydown", movePlayer);
}

function movePlayer(evt){
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

function anyKey(){
    anyKeyPressed = document.addEventListener("keydown", loadNextLevel);
}

function loadNextLevel(evt){
    if(anyKeyPressed){
        level++;
        startGame();
        anyKeyPressed = false;
    }
}

//dir is a Vector2
function moveRock(x, y, dir){
    var rock = getRock(x, y);
    const i = setInterval(() => {
        translateRock(rock, dir, i);
    }, FRAME_RATE);
}

function translateRock(rock, dir, interval){
    
    //check if rock ran into something
    if(checkValidMapPos(rock.tileX + dir.x, rock.tileY + dir.y) == false || 
       map[rock.tileX + dir.x][rock.tileY + dir.y] == "cave"){
        clearInterval(interval);
        map[rock.tileX][rock.tileY] = "rock";
        return;
    }

    //update tile behind rock and rock x and y
    if(map[rock.tileX][rock.tileY] != "fire_idle" && map[rock.tileX][rock.tileY] != "fire_smoke"){
        map[rock.tileX][rock.tileY] = "grass";
    }
    rock.x += (dir.x * ROLL_SPEED);
    rock.y += (dir.y * ROLL_SPEED);

    if(dir == directions.left){
        rock.rotation -= 45;
    }
    else{
        rock.rotation += 45;
    }
    //check if off screen
    if(rock.x <= (0 - TILE_HW) || rock.x >= canvas.width || rock.y <= (0 - TILE_HW) || rock.y >= canvas.height){
        ctx.drawImage(getImageByName("grass"), rock.tileX * TILE_HW, rock.tileY * TILE_HW);
        clearInterval(interval);
        //removeItemFromArray(rocks, rock);
        return;
    }

    //increase rock tile index x
    if(rock.x % TILE_HW== 0){
        rock.tileX += dir.x;
    }

    //increase rock tile index y
    if(rock.y % TILE_HW == 0){
        rock.tileY += dir.y;
    }

    //draw grass in front and behind
    ctx.drawImage(getImageByName("grass"), rock.tileX * TILE_HW, rock.tileY * TILE_HW);
    ctx.drawImage(getImageByName("grass"), (rock.tileX - dir.x) * TILE_HW, (rock.tileY - dir.y) * TILE_HW);

    //redraw player
    if(player.tileX == rock.tileX - dir.x && player.tileY == rock.tileY - dir.y){
        player.draw();
    }

    //redraw fire
    if((fire.tileX == rock.tileX && fire.tileY == rock.tileY) || (fire.tileX == rock.tileX - dir.x && fire.tileY == rock.tileY - dir.y)){
        
        //make fire smoke
        if(fire.img.name != "fire_smoke"){
            fire.img = getImageByName("fire_smoke");
            map[fire.tileX][fire.tileY] = "fire_smoke";
        }
        fire.draw();
    }

    ctx.save();
    ctx.translate(rock.x + TILE_HW/2, rock.y + TILE_HW/2);
    ctx.rotate(rock.rotation * Math.PI/180);
    ctx.translate(-(rock.x + TILE_HW/2), -(rock.y + TILE_HW/2));

    //draw rock with new position
    ctx.drawImage(getImageByName("rock"), rock.x, rock.y);
    ctx.restore();
}