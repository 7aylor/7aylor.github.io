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

            resetFireCaveman(2, 2, 5, 2, 5, 5);
            break;

        case 2: 
            for(var col = 0; col < NUM_COLSROWS; col++){
                for(var row = 0; row < NUM_COLSROWS; row++){
                    if(col == 0 || col == NUM_COLSROWS - 1 || row == 0 || row == NUM_COLSROWS - 1){
                        map[row][col] = "tree";
                    }
                }
            }
            
            map[4][1] = "tree";
            map[4][2] = "tree";
            map[5][1] = "tree";
            map[6][1] = "tree";
            map[6][2] = "tree";

            initRocks([
                {x: 4, y: 5}, 
                {x: 5, y: 4}, 
                {x: 6, y: 5}, 
                {x: 5, y: 6}
            ]);

            resetFireCaveman(2, 5, 5, 2, 5, 5);
            break;
        
        case 3:
            spawnRowOfObjs("tree", 0);
            spawnRowOfObjs("tree", 7);
            
            initRocks([
                {x: 2, y: 2},
                {x: 2, y: 3},
                {x: 3, y: 2}, 
                {x: 2, y: 5}
            ]);
            map[0][4] = "wall";
            map[1][4] = "wall";

            map[0][5] = "wall";
            map[0][6] = "wall";
            map[1][6] = "wall";
            
            
            map[7][1] = "wall";
            map[7][2] = "wall";
            map[7][3] = "wall";
            map[6][3] = "wall";
            map[5][3] = "wall";

            map[0][3] = "wall";
            map[4][3] = "wall";
            map[3][1] = "wall";

            resetFireCaveman(1, 5, 6, 2, 5, 5);

            break;

        case 4:
            spawnObsAroundMap("tree");
            spawnColOfObjs("tree", 6);
            spawnColOfObjs("tree", 5);
            spawnRowOfObjs("tree", 6);
            initRocks([
                {x: 2, y: 2},
                {x: 2, y: 3},
                {x: 3, y: 2},
                {x: 3, y: 4},
                {x: 4, y: 3}
            ]);

            map[1][4] = "wall";
            map[4][5] = "wall";

            resetFireCaveman(3, 3, 1, 1, 4, 2);
            break;
        case 5:
            for(var col = 0; col < NUM_COLSROWS; col++){
                for(var row = 0; row < NUM_COLSROWS; row++){
                    if(row > 3){
                        map[row][col] = "tree";
                    }
                    else if (row == 0 || row == NUM_COLSROWS - 1 || col == 0 || col == NUM_COLSROWS -1){
                        map[row][col] = "tree";
                    }
                }
            }

            map[1][1] = "wall";

            initRocks([
                {x: 2, y: 3},
                {x: 2, y: 5},
                {x: 3, y: 2},
                {x: 3, y: 5},
                {x: 4, y: 4}
            ]);

            resetFireCaveman(1, 5, 2, 0, 5, 4);
            break;

        case 6:
            winScreen();
            return;
    }

    drawMap();
    player.draw();
}

function resetFireCaveman(fireX, fireY, caveX, caveY, playerX, playerY){
    map[caveX][caveY] = "cave";
    if(fire == null){
        fire = new AnimatedObjectClass(fireX, 2, "fire_idle", "grass", 15);
    }else{
        fire.setPos(fireX, fireY, "fire_idle");
        fire.img = getImageByName("fire_idle");
    }
    fire.active = true;

    player.hasFire = false;
    player.img = getImageByName("caveman_idle");
    player.tileX = playerX;
    player.tileY = playerY;
}

function spawnObsAroundMap(type){
    for(var col = 0; col < NUM_COLSROWS; col++){
        for(var row = 0; row < NUM_COLSROWS; row++){
            if (row == 0 || row == NUM_COLSROWS - 1 || col == 0 || col == NUM_COLSROWS -1){
                map[row][col] = type;
            }
        }
    }
}

function spawnRowOfObjs(type, col){
    for(var row = 0; row < NUM_COLSROWS; row++){
            map[row][col] = type;
    }
}

function spawnColOfObjs(type, row){
    for(var col = 0; col < NUM_COLSROWS; col++){
            map[row][col] = type;
    }
}