var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
const NUM_COLSROWS = 8;
const TILE_HW = 64;
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const R = 82;
const FRAME_RATE = 1000/30;
const ROLL_SPEED = 8;

var keyDown = false;

var rawImages = [
    "art/img/cave.png",
    "art/img/caveman_idle.png",
    "art/img/caveman_torch.png",
    "art/img/fire_idle.png",
    "art/img/fire_smoke.png",
    "art/img/grass.png",
    "art/img/rock.png",
    "art/img/wall.png",
    "art/img/tree.png",
    "art/img/stone_ground.png"
];

var obstacles = [
    "tree",
    "rock",
    "wall"
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
var music;

var playing;
var anyKeyPressed;
var beginning = true;
var gameEnding = false;

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
    
    player = new PlayerClass(5, 5, getImageByName("caveman_idle"), "grass", 15);
    fire = new AnimatedObjectClass(2, 2, getImageByName("fire_idle"), "grass", 15);
    setPlayerInput();
    loadLevel(level);
    if(music == null){
        music = new SoundClass("sound/music/Faning_the_Flames.mp3", true);
        music.play();
    }
    playing = setInterval(update, FRAME_RATE); //set fps to 30
}

function loadImage(){
    if (imagesLoaded < rawImages.length) {
        var name = rawImages[imagesLoaded]; //used to get name from rawImage name
        var img = new ImageClass(name, name.substring(8, name.length - 4));
    } else {
        document.fonts.load('20pt "stone"').then(loadFont);
    }
}

function loadFont(){
    ctx.font = '30px "stone"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    startMenu();
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
}

function getImageByName(name){
    for(var i = 0; i < images.length; i++){
        if(images[i].name == name){
            return images[i];
        }
    }
}