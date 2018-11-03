var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
const NUM_COLSROWS = 8;
const TILE_HW = 64;

var rawImages = [
    "art/img/cave.png",
    "art/img/caveman.png",
    "art/img/fire.png",
    "art/img/grass.png",
    "art/img/rock.png",
    "art/img/rock_wall.png",
    "art/img/tree.png"
];

var images = [];

var map = [];
var imagesLoaded = 0;

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
    }
}

function startGame(){
    //setInterval(update, 1000/30); //set fps to 30
    drawMap();
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

    map[3][3] = "caveman";
    map[6][3] = "cave";
    map[5][5] = "tree";
    map[1][7] = "fire";
    map[1][1] = "rock";
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
            if(getImageByName(map[x][y]) != "grass"){
                ctx.drawImage(getImageByName(map[x][y]), x * TILE_HW, y * TILE_HW);
            }
        }
    }
}

function getImageByName(name){
    for(var i = 0; i < images.length; i++){
        if(images[i].name == name){
            return images[i];
        }
    }
}

function ImageClass(path, name){
    this.image = new Image();
    this.isLoaded = false;
    this.image.name = name;
    this.image.onload = function () {
        checkImagesLoaded(this.image);
    }.bind(this);
    this.image.src = path;
}