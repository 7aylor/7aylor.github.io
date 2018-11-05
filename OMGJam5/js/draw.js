var rad = 1.5 * TILE_HW;
var fireOffsetX = 0;
var fireOffsetY = 0;
var endScreenPlaying;
var count = 0;
var fading;
var startFires;
var startCaveman;

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
            // ctx.fillStyle = "white";
            // ctx.font = "10px stone";
            // ctx.fillText(x + ", " + y,  (x * TILE_HW) + (TILE_HW/2), (y * TILE_HW) + (TILE_HW/2))
        }
    }

    if(level == 1){
        drawResetMessage();
    }
}

function startMenu(){

    anyKey();
    ctx.fillStyle = "#71aa34";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    startFires = [];

    for(var col = 0; col < NUM_COLSROWS; col++){
        for(var row = 0; row < NUM_COLSROWS; row++){
            map[col][row] = "grass";
            if(col == 0 || col == NUM_COLSROWS - 1 || row == 0 || row == NUM_COLSROWS - 1){
                map[col][row] = "tree";
            }
            if(col > 0 && col < NUM_COLSROWS - 1 && (row == 1 || row == NUM_COLSROWS - 2)){
               map[col][row] = "wall";
            }
        }
    }
    
    map[3][4] = "wall";
    map[4][3] = "wall";
    map[4][4] = "cave";

    initRocks([
        {x: 2, y: 2},
        {x: 2, y: 5},
        {x: 5, y: 5},
        {x: 5, y: 2}
    ]);
    
    startCaveman = new AnimatedObjectClass(3,3, getImageByName("caveman_idle"), "grass", 15);
    startFires.push(new AnimatedObjectClass(1, 5, getImageByName("fire_idle"), "grass", 15));
    startFires.push(new AnimatedObjectClass(1, 2, getImageByName("fire_idle"), "grass", 15));
    startFires.push(new AnimatedObjectClass(6, 2, getImageByName("fire_idle"), "grass", 15));
    startFires.push(new AnimatedObjectClass(6, 5, getImageByName("fire_idle"), "grass", 15));
    
    drawMap();
    startAnimsInterval = setInterval(moveStartMenuAnims, FRAME_RATE);

    prepareText(30);
    ctx.fillText("Rock and Rolling Rocks", canvas.width/2, canvas.height/4 - (TILE_HW/2));
    ctx.fillText("Press any Key to Start", canvas.width/2, 3 * canvas.height/4 + (TILE_HW/2));

}

function moveStartMenuAnims(){
    tick++;
    for(var i = 0; i < rocks.length; i++){
        rotateRock(rocks[i], 25);
    }

    for(var i = 0; i < startFires.length; i++){
        startFires[i].updateSprite();
    }

    startCaveman.updateSprite();
}

function winScreen(){
    ctx.fillStyle= "#302c2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.background = "stone_ground";
    fire.background = "stone_ground";
    player.tileX = 3;
    player.tileY = 2;

    fire.tileX = 3;
    fire.tileY = 3;

    document.removeEventListener("keydown", movePlayer);
    document.removeEventListener("keydown", reset);

    if(music != null){
        music.stop();
    }
    music = new SoundClass("sound/Cave_Sweet_Cave.mp3", false, 0.2);
    music.play();

    endScreenPlaying = setInterval(drawInsideCave, FRAME_RATE);
}

function drawInsideCave(){

    clearInterval(playing);
    
    tick++;
    // player.active = false;
    // fire.active = false;

    for(var x = 0; x < NUM_COLSROWS; x++){
        for(var y = 0; y < NUM_COLSROWS; y++){
            if(x == 0 || x == NUM_COLSROWS - 1 || y == 0 || y == NUM_COLSROWS - 1){
                ctx.drawImage(getImageByName("wall"), x * TILE_HW, y * TILE_HW);
            }
            else{
                ctx.drawImage(getImageByName("stone_ground"), x * TILE_HW, y * TILE_HW);
            }
        }
    }

    player.updateSprite();
    if(fire != null){fire.updateSprite();}

    player.draw();
    fire.draw();

    ctx.drawImage(getImageByName("cave"), 3 * TILE_HW, TILE_HW);

    var maskCanvas = document.createElement('canvas');

    //draw mask for fire light effect
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    var maskCtx = maskCanvas.getContext('2d');
    maskCtx.fillStyle = ctx.fillStyle = "rgb(0,0,0,0.7)";;
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.globalCompositeOperation = 'xor';

    if(tick % (player.animSpeed * 2) == 0){
        rad = 1.5 * TILE_HW;
    }
    else if(tick % player.animSpeed == 0){
        rad = ((Math.random() * (2 - 1.6)) + 1.6) * TILE_HW;
    }
    
    maskCtx.arc((fire.tileX * TILE_HW) + TILE_HW/2, 
                (fire.tileY * TILE_HW) + TILE_HW/2, 
                rad, 0, 2 * Math.PI);
    maskCtx.fill();

    ctx.drawImage(maskCanvas, 0, 0);

    prepareText(30);
    ctx.fillText("Welcome home!", canvas.width/2, TILE_HW - TILE_HW/2);
    prepareText(20);
    ctx.fillText("Art and Programming: Taylor Buchheit", canvas.width/2, canvas.height - (3 * (TILE_HW/2)));
    ctx.fillText("Music and SFX: Kristin Kirk", canvas.width/2, canvas.height - TILE_HW/2);

    if(gameEnding == true){
        clearInterval(endScreenPlaying);
        fading = setInterval(fadeOut, FRAME_RATE);
    }
}

function drawResetMessage(){
    ctx.fillStyle = "rgb(0,0,0,0.75)"
    ctx.fillRect(TILE_HW * 2, canvas.height - TILE_HW, TILE_HW * 4, TILE_HW);
    prepareText(16);
    ctx.fillText(" Stuck? Press R to reset", TILE_HW * 4, canvas.height - TILE_HW/2);
}

function fadeOut(){
    ctx.fillStyle = "rgb(0,0,0, 0.15)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    count++;
    if(count > 60){
        count = 0;
        clearInterval(fading);
        beginning = true;
        level = 0;
        gameEnding = false;
        music = null;
        startMenu();
    }
}

function prepareText(size){
    ctx.font= size + "px stone";
    ctx.textAlign="center"; 
    ctx.fillStyle = "white";
}