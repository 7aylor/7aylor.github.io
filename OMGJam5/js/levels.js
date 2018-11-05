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
                {x: 3, y: 1},
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
            spawnObsAroundMap("wall");
            // spawnColOfObjs("wall", 2);
            map[2][2] = "tree";
            map[2][4] = "tree";
            map[2][6] = "tree";

            // map[4][2] = "tree";
            map[4][5] = "tree";
            // map[5][3] = "tree";
            map[6][2] = "tree";
            map[6][5] = "tree";


            initRocks([
                {x: 1, y: 2},
                {x: 2, y: 4},
                {x: 3, y: 1},
                {x: 3, y: 3},
                {x: 4, y: 2},
                {x: 4, y: 4},
                {x: 5, y: 3},
                {x: 5, y: 6}
            ]);

            map[2][1] = "grass";
            map[2][5] = "grass";

            resetFireCaveman(1, 6, 5, 0, 6, 6);

            break;

        case 7:
            spawnColOfObjs("wall", 1);
            spawnColOfObjs("wall", 4);
            spawnColOfObjs("wall", 7);
            spawnRowOfObjs("wall", 0);
            
            map[1][6] = "grass";
            map[1][7] = "grass";
            map[0][2] = "wall";
            map[0][7] = "tree";
            map[2][4] = "tree";
            map[3][6] = "tree";
            map[4][7] = "tree";
            map[5][6] = "tree";
            
            initRocks([
                {x: 0, y: 6},
                {x: 1, y: 1},
                {x: 2, y: 2},
                {x: 2, y: 6},
                {x: 3, y: 3},
                {x: 4, y: 4},
                {x: 4, y: 7},
                {x: 5, y: 3},
                {x: 6, y: 6}
            ]);

            resetFireCaveman(6, 0, 0, 3, 0, 0);

            break;

        case 8:

            spawnColOfObjs("wall", 7);
            spawnColOfObjs("tree", 1);
            spawnRowOfObjs("tree", 0);
            map[0][0] = "tree";
            map[0][1] = "tree";
            map[3][1] = "tree";
            map[4][1] = "tree";
            map[5][1] = "tree";

            map[2][7] = "wall";
            map[3][7] = "wall";
            map[4][7] = "wall";
            map[5][7] = "wall";
            map[6][1] = "wall";
            map[6][7] = "wall";

            map[1][1] = "grass";
            map[1][2] = "grass";

            initRocks([
                {x: 2, y: 2},
                {x: 3, y: 3},
                {x: 3, y: 4},
                {x: 3, y: 5},
                {x: 4, y: 3},
                {x: 4, y: 5},
                {x: 5, y: 3},
                {x: 5, y: 4},
                {x: 5, y: 5},
                {x: 6, y: 2},
            ]);

            resetFireCaveman(7, 4, 0, 7, 4, 4);

            break;

        case 9: 
            
            map[0][2] = "tree";
            map[0][3] = "tree";
            map[1][0] = "tree";
            map[2][2] = "tree";
            map[3][2] = "tree";
            map[4][1] = "tree";
            map[5][1] = "tree";
            map[7][0] = "tree";
            map[7][1] = "tree";
            map[7][3] = "tree";

            map[0][5] = "wall";
            map[0][6] = "wall";
            map[0][7] = "wall";
            map[2][6] = "wall";
            map[3][6] = "wall";
            map[6][3] = "wall";
            map[6][5] = "wall";
            map[6][7] = "wall";
            map[7][5] = "wall";

            spawnRowOfObjs("wall", 4);
            initRocks([
                {x: 1, y: 6},
                {x: 2, y: 3},
                {x: 2, y: 7},
                {x: 3, y: 4},
                {x: 4, y: 0},
                {x: 4, y: 6},
                {x: 5, y: 4}
            ]);

            resetFireCaveman(0, 0, 7, 7, 1, 7);

            break;

        case 10: 

            spawnColOfObjs("tree", 0);
            spawnColOfObjs("wall", 5);
            map[1][1] = "tree";
            map[1][3] = "tree";
            map[1][5] = "tree";
            map[1][7] = "tree";

            map[3][0] = "wall";
            map[4][0] = "wall";
            map[4][1] = "wall";
            map[4][2] = "wall";
            map[4][4] = "wall";
            map[4][6] = "wall";
            map[6][1] = "wall";
            map[1][0] = "grass";

            initRocks([
                {x: 2, y: 2},
                {x: 3, y: 3},
                {x: 2, y: 4},
                {x: 3, y: 5},
                {x: 2, y: 6},
                {x: 3, y: 7},
                {x: 7, y: 1},
                {x: 7, y: 2},
                {x: 7, y: 3},
                {x: 7, y: 4},
                {x: 7, y: 5},
                {x: 7, y: 6}
            ]);

            map[1][0] = "grass";
            map[5][7] = "grass";

            resetFireCaveman(5, 0, 7, 7, 0, 0);
            break;

        case 11:
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