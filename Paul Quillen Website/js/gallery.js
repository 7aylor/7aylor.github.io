const pics = [
    /*"../img/gallery/gallery_live.jpg",
    "../img/gallery/gallery_stage.jpg",
    "../img/gallery/gallery_playing.jpg",
    "../img/gallery/gallery_portrait.jpg",*/
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_live.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_playing.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_portrait.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_stage.jpg?raw=true"    
]

const exitBtn = document.getElementById("exit");
const gallery = document.getElementById("gallery");
const leftArr = document.getElementById("left-arrow");
const rightArr = document.getElementById("right-arrow");
const counter = document.getElementById("counter");
const img = document.getElementById("gallery-img");

let currImg = 0;
let currY = 0;
let canClickArrow = false;

function exitGallery(){
    window.removeEventListener('scroll', noscroll);
    gallery.style.display = 'none';
}

function openGallery(){
    gallery.style.display = 'block';
    img.src = pics[currImg];
    currY = window.scrollY;
    window.addEventListener('scroll', noscroll);
    //wait for image to load before allowing another click,
    //not using arrow function because ie doesn't support it
    img.onload = function() { updateCounterAndCanClick() };
}

function prevPic(){
    if(canClickArrow == true){
        canClickArrow = false;
        currImg--;
        
        if(currImg == -1){
            currImg = pics.length - 1;
        }

        img.src = pics[currImg];
        //wait for image to load before allowing another click
        img.onload = function() { updateCounterAndCanClick() };
    }
}

function nextPic(){
    if(canClickArrow == true){
        canClickArrow = false;
        currImg++;
        
        if(currImg == pics.length){
            currImg = 0;
        }
    
        img.src = pics[currImg];
        //wait for image to load before allowing another click
        img.onload = function() { updateCounterAndCanClick() };
    }
}

function updateCounterAndCanClick(){
    counter.innerHTML = currImg + 1 + " / " + pics.length;
    canClickArrow = true;
}

function noscroll() {
    window.scrollTo(0, currY);
}

