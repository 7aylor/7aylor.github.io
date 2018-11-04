var level = 0;

function loadLevel(levelIndex){
    initMap();
    switch(levelIndex){
        case 1:
            for(var col = 0; col < NUM_COLSROWS; col++){
                for(var row = 0; row < NUM_COLSROWS; row++){
                    if(col == 0 || col == NUM_COLSROWS - 1 || row == 0 || row == NUM_COLSROWS - 1){
                        map[col][row] = "tree";
                    }
                }
            }
            
            map[5][2] = "cave";
            fire.setPos(2, 2, "fire_idle");
            break;

        case 2: 
            for(var col = 0; col < NUM_COLSROWS; col++){
                for(var row = 0; row < NUM_COLSROWS; row++){
                    if(col == 0 || col == NUM_COLSROWS - 1 || row == 0 || row == NUM_COLSROWS - 1){
                        map[col][row] = "tree";
                    }
                }
            }
            
            map[4][1] = "tree";
            map[4][2] = "tree";
            map[5][1] = "tree";
            map[6][1] = "tree";
            map[6][2] = "tree";
            initRocks([{x: 4, y: 5}, {x: 5, y: 4}, {x: 6, y: 5}, {x: 5, y: 6}]);
            map[5][2] = "cave";
            fire.setPos(2, 5, "fire_idle");
            break;
        
        case 3:
            for(var col = 0; col < NUM_COLSROWS; col++){
                map[col][0] = "tree";
                map[col][NUM_COLSROWS - 1] = "tree";
            }
            
            initRocks([{x: 3, y: 5}, {x: 4, y: 2}]);
            map[0][4] = "rock_wall";
            map[1][4] = "rock_wall";
            map[2][4] = "rock_wall";
            map[0][5] = "rock_wall";
            map[0][6] = "rock_wall";
            map[1][6] = "rock_wall";
            map[2][6] = "rock_wall";
            
            map[7][1] = "rock_wall";
            map[6][1] = "rock_wall";
            map[5][1] = "rock_wall";
            map[7][2] = "rock_wall";
            map[7][3] = "rock_wall";
            map[6][3] = "rock_wall";
            map[5][3] = "rock_wall";

            map[6][2] = "cave";
            fire.setPos(1, 5, "fire_idle");
            break;

        case 4:
            map[0][0] = "tree";
            map[0][1] = "tree";
            initRocks([{x: 3, y: 1}]);

            map[1][0] = "cave";
            fire.setPos(6, 6, "fire_idle");
            break;
    }

    player.tileX = 5;
    player.tileY = 5;
    fire.img = getImageByName("fire_idle");
    drawMap();
    player.draw();
}