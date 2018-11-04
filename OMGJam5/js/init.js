var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
const NUM_COLSROWS = 8;
const TILE_HW = 64;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const FRAME_RATE = 1000/30;
const ROLL_SPEED = 8;

var rawImages = [
    "art/img/cave.png",
    "art/img/caveman_idle.png",
    "art/img/caveman_torch.png",
    "art/img/fire_idle.png",
    "art/img/fire_smoke.png",
    "art/img/grass.png",
    "art/img/rock.png",
    "art/img/rock_wall.png",
    "art/img/tree.png"
];

var obstacles = [
    "tree",
    "rock",
    "rock_wall"
]

var rocks = [];

var directions = {
    up: new Vector2(0, -1),
    down: new Vector2(0, 1),
    left: new Vector2(-1, 0),
    right: new Vector2(1, 0)
};

var images = [];
var map = [];
var imagesLoaded = 0;

var player;
var fire;
var tick = 0;

var level = 1;
var playing;
var anyKeyPressed = false;

window.onload = function(){
    init();
}

//get canvas and ctx
function init(){
    //if we can't get canvas context, user is on an unsupported browser
    if(!ctx){
        document.createTextNode("Unsupported browser");
    }
    else{
        
        canvas.width = 512;
        canvas.height = 512;
        ctx.fillStyle = "#71aa34";
        loadImage();
        initMap();
    }
}

function startGame(){
    player = new PlayerClass(5, 5, getImageByName("caveman_idle"), 15);
    fire = new AnimatedObjectClass(2, 2, getImageByName("fire_idle"), 15);
    setPlayerInput();
    loadLevel(level);
    drawMap();
    player.draw();
    playing = setInterval(update, FRAME_RATE); //set fps to 30
}

function loadImage(){
    if (imagesLoaded < rawImages.length) {
        var name = rawImages[imagesLoaded]; //used to get name from rawImage name
        var img = new ImageClass(name, name.substring(8, name.length - 4));
    } else {
        startGame();
    }
}

function checkImagesLoaded(img){
    img.isLoaded = true;
    images.push(img);
    imagesLoaded++;
    loadImage();
}

function initMap(){
    for(var x = 0; x < NUM_COLSROWS; x++){
        map[x] = new Array();
        for(var y = 0; y < NUM_COLSROWS; y++){
            map[x][y] = "grass";
        }
    }
}

function initRocks(rockObjs){
    rocks = [];
    
    for(var i = 0; i < rockObjs.length; i++){
        rocks.push(new Rock(rockObjs[i].x, rockObjs[i].y));
    }
    console.log(map);
}

function getImageByName(name){
    for(var i = 0; i < images.length; i++){
        if(images[i].name == name){
            return images[i];
        }
    }
}

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
            
            //initRocks([{x: 1, y: 3}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 6, y: 3},]);
            initRocks([{x: 4, y: 5}, {x: 5, y: 4}, {x: 6, y: 5}, {x: 5, y: 6}]);
            map[5][2] = "cave";
            fire.setPos(2, 2, "fire_idle");
            break;
    }
}