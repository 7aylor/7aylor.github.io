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

    this.move = function(newTileX, newTileY){
        if(this.checkValidMapPos(newTileX, newTileY)){
            //clearMapPos(this.tileX, this.tileY);
            ctx.drawImage(getImageByName("grass"), this.tileX * TILE_HW, this.tileY * TILE_HW);
            this.tileX = newTileX;
            this.tileY = newTileY;
            //this.setPlayerMapPos();
            this.draw();
        }

        console.log(this.tileX + ", " + this.tileY);
    }

    this.checkValidMapPos = function(x, y){
        if(obstacles.includes(map[x][y])){
            return false;
        }
        return true;
    }

    this.setPlayerMapPos = function(){
        map[this.tileX][this.tileY] = "caveman";
    }
    //this.setPlayerMapPos();
}

function AnimatedObjectClass(x, y, sprite_sheet, animation_speed){
    this.tileX = x;
    this.tileY = y;
    this.img = sprite_sheet;
    this.numSprites = sprite_sheet.width / TILE_HW;
    this.animSpeed = animation_speed;
    this.spriteIndex = 0;

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
}