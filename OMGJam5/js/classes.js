function ImageClass(path, name){
    this.image = new Image();
    this.isLoaded = false;
    this.image.name = name;
    this.image.onload = function () {
        checkImagesLoaded(this.image);
    }.bind(this);
    this.image.src = path;
}

function PlayerClass(x, y, sprite_sheet, animation_speed){
    AnimatedObjectClass.call(this, x, y, sprite_sheet, animation_speed);

    console.log("x: " + x + " y: " + y);
    this.hasFire = false;
    this.canMove = true;

    this.move = function(newTileX, newTileY, dir){
        if(this.canMove == false){
            return;
        }

        if(newTileX < 0 || newTileX >= NUM_COLSROWS || newTileY < 0 || newTileY >= NUM_COLSROWS){
            return;
        }
        if(map[newTileX][newTileY] == "rock"){
            moveRock(newTileX, newTileY, dir);
            return;
        }
        if(checkValidMapPos(newTileX, newTileY)){
            //win condition
            if(map[newTileX][newTileY] == "cave"){
                if(this.hasFire == true){
                    ctx.fillStyle = "rgb(0,0,0,0.5)";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font="30px Verdana";
                    ctx.textAlign="center"; 
                    ctx.fillStyle = "white";
                    ctx.fillText("Level " + level + " complete!", canvas.width/2, canvas.height/2);
                    ctx.fillText("Press any key to continue", canvas.width/2, (3 * canvas.height)/4);
                    clearInterval(playing);
                    document.removeEventListener("keydown", movePlayer);
                    anyKey();
                    anyKeyPressed = true;
                    return;
                }
                else{
                    return;
                }
            }
            if(map[newTileX][newTileY] == "fire_smoke"){
                return;
            }
            if(map[newTileX][newTileY] == "fire_idle"){
                this.img = getImageByName("caveman_torch");
                this.hasFire = true;
                fire = null;
                map[newTileX][newTileY] = "grass";
            }
            
            ctx.drawImage(getImageByName("grass"), this.tileX * TILE_HW, this.tileY * TILE_HW);
            this.tileX = newTileX;
            this.tileY = newTileY;
            this.draw();
        }
    }

    this.setPlayerMapPos = function(){
        map[this.tileX][this.tileY] = "caveman";
    }
}

function AnimatedObjectClass(x, y, sprite_sheet, animation_speed){
    this.tileX = x;
    this.tileY = y;
    this.img = sprite_sheet;
    this.numSprites = sprite_sheet.width / TILE_HW;
    this.animSpeed = animation_speed;
    this.spriteIndex = 0;
    map[this.tileX][this.tileY] = sprite_sheet.name;

    this.updateSprite = function(){
        if(tick % this.animSpeed == 0){
            if(this.spriteIndex == this.numSprites - 1){
                this.spriteIndex = 0;
            }
            else{
                this.spriteIndex++;
            }
            this.draw();
        }
    }

    this.draw = function(){
        ctx.drawImage(getImageByName("grass"), this.tileX * TILE_HW, this.tileY * TILE_HW);
        ctx.drawImage(this.img, this.spriteIndex * TILE_HW, 0, TILE_HW, TILE_HW, this.tileX * TILE_HW, this.tileY * TILE_HW, TILE_HW, TILE_HW);
    }

    this.setPos = function(x, y, name){
        this.tileX = x;
        this.tileY = y;
        map[x][y] = name;
    }
}

function Vector2(x, y){
    this.x = x;
    this.y = y;
}

function Rock(x, y){
    this.tileX = x;
    this.tileY = y;
    this.x = this.tileX * TILE_HW;
    this.y = this.tileY * TILE_HW;
    this.rotation = 0;
    this.moving = false;

    this.getRockByCoord = function(x, y){
        if(x == this.tileX && y == this.tileY){
            return 1;
        }
        else{
            return -1;
        }
    }

    map[x][y] = "rock";
}