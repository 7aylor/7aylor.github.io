function drawMap(){
    for(var x = 0; x < NUM_COLSROWS; x++){
        for(var y = 0; y < NUM_COLSROWS; y++){
            ctx.drawImage(getImageByName("grass"), x * TILE_HW, y * TILE_HW);
        }
    }

    for(var x = 0; x < NUM_COLSROWS; x++){
        for(var y = 0; y < NUM_COLSROWS; y++){
            if(getImageByName(map[x][y]) != "grass" && getImageByName(map[x][y]) != "fire_idle"){
                ctx.drawImage(getImageByName(map[x][y]), x * TILE_HW, y * TILE_HW);
            }

            //show tile coords
            ctx.fillStyle = "white";
            ctx.font = "10px Verdana";
            ctx.fillText(x + ", " + y,  (x * TILE_HW) + (TILE_HW/2), (y * TILE_HW) + (TILE_HW/2))
        }
    }
}

function startMenu(){

    anyKey();
    ctx.fillStyle = "#71aa34";
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var x = 0; x < NUM_COLSROWS; x++){
        for(var y = 0; y < NUM_COLSROWS; y++){
            ctx.drawImage(getImageByName("grass"), x * TILE_HW, y * TILE_HW);
        }
    }
    for(var x = 0; x < NUM_COLSROWS; x++){
        for(var y = 0; y < NUM_COLSROWS; y++){
            ctx.drawImage(getImageByName("tree"), x * TILE_HW, y * TILE_HW);
        }
    }

    ctx.font="30px Verdana";
    ctx.textAlign="center"; 
    ctx.fillStyle = "white";
    ctx.fillText("Rock and Rolling Rocks", canvas.width/2, canvas.height/4 + TILE_HW/2);
    ctx.fillText("Press any Key to Start", canvas.width/2, 3 * canvas.height/4 + TILE_HW/2);

}