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
        }
    }
}