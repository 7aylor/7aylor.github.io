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
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        initMap();
        loadImage();
        initRocks();
    }
}

function startGame(){
    player = new PlayerClass(5, 5, getImageByName("caveman_idle"), 15);
    fire = new AnimatedObjectClass(2, 2, getImageByName("fire_idle"), 15);
    setPlayerInput();
    setInterval(update, FRAME_RATE); //set fps to 30
    drawMap();
    player.draw();
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

    map[5][4] = "tree";
    map[6][3] = "cave";
    map[2][6] = "tree";
    map[1][4] = "tree";
    map[0][0] = "rock_wall";
    map[0][1] = "rock_wall";
    map[0][2] = "rock_wall";
    map[0][3] = "rock_wall";
    map[0][4] = "rock_wall";
    map[0][5] = "rock_wall";
    map[0][6] = "rock_wall";
    map[0][7] = "rock_wall";
}

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

function initRocks(){
    rocks.push(new Rock(2, 4));
    rocks.push(new Rock(4, 6));
    rocks.push(new Rock(7, 6));
}

function getImageByName(name){
    for(var i = 0; i < images.length; i++){
        if(images[i].name == name){
            return images[i];
        }
    }
}