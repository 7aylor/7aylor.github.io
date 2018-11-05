function update(){
    tick++;
    player.updateSprite();
    if(fire != null){fire.updateSprite();}
}

//dir is a Vector2
function moveRock(x, y, dir){
    var rock = getRock(x, y);
    const i = setInterval(() => {
        translateRock(rock, dir, i);
    }, FRAME_RATE);
}

function translateRock(rock, dir, interval){
    
    var newTileX = rock.tileX + dir.x;
    var newTileY = rock.tileY + dir.y;
    rock.moving = true;
    player.canMove = false;

    //check if rock ran into something
    if(checkValidMapPos(newTileX, newTileY) == false || 
       ((newTileX >= 0 && newTileX < NUM_COLSROWS && newTileY >= 0 && newTileY < NUM_COLSROWS) &&
       (map[newTileX][newTileY] == "cave"))){

        if(rock.tileX == fire.tileX && rock.tileY == fire.tileY){
            fire.active = false;
        }

        clearInterval(interval);
        map[rock.tileX][rock.tileY] = "rock";
        rock.moving = false;
        player.canMove = true;
        return;
    }

    //update tile behind rock and rock x and y
    if(map[rock.tileX][rock.tileY] != "fire_idle" && map[rock.tileX][rock.tileY] != "fire_smoke"){
        map[rock.tileX][rock.tileY] = "grass";
    }
    rock.x += (dir.x * ROLL_SPEED);
    rock.y += (dir.y * ROLL_SPEED);

    //check if off screen
    if(rock.x <= (0 - TILE_HW) || rock.x >= canvas.width || rock.y <= (0 - TILE_HW) || rock.y >= canvas.height){
        ctx.drawImage(getImageByName("grass"), rock.tileX * TILE_HW, rock.tileY * TILE_HW);
        clearInterval(interval);
        rock.moving = false;
        player.canMove = true;
        return;
    }

    //increase rock tile index x
    if(rock.x % TILE_HW== 0){
        sfx[2].play();
        rock.tileX += dir.x;
    }

    //increase rock tile index y
    if(rock.y % TILE_HW == 0){
        sfx[2].play();
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
    if(fire.active == true && ((fire.tileX == rock.tileX && fire.tileY == rock.tileY) || 
        (fire.tileX == rock.tileX - dir.x && fire.tileY == rock.tileY - dir.y))){
        
        //make fire smoke
        if(fire.img.name != "fire_smoke"){
            fire.img = getImageByName("fire_smoke");
            map[fire.tileX][fire.tileY] = "fire_smoke";
            sfx[3].play();

            if(level == 2){
                drawResetMessage();
            }
        }
        fire.draw();
    }

    rotateRock(rock, 45, dir);
}

function rotateRock(rock, speed, dir){
    if(dir == directions.left){
        rock.rotation -= speed;
    }
    else{
        rock.rotation += speed;
    }

    ctx.save();
    ctx.translate(rock.x + TILE_HW/2, rock.y + TILE_HW/2);
    ctx.rotate(rock.rotation * Math.PI/180);
    ctx.translate(-(rock.x + TILE_HW/2), -(rock.y + TILE_HW/2));

    //draw rock with new position
    ctx.drawImage(getImageByName("rock"), rock.x, rock.y);
    ctx.restore();
}