const pics = [
    "/img/gallery_live.jpg",
    "/img/gallery_stage.jpg",
    "/img/gallery_playing.jpg",
    "/img/gallery_portrait.jpg"
]

const exitBtn = document.getElementById("exit");
const gallery = document.getElementById("gallery");
const leftArr = document.getElementById("left-arrow");
const rightArr = document.getElementById("right-arrow");
const counter = document.getElementById("counter");
const img = document.getElementById("gallery-img");

let currImg = 0;
let currY = 0;

function exitGallery(){
    window.removeEventListener('scroll', noscroll);
    gallery.style.display = 'none';
}

function openGallery(){
    gallery.style.display = 'block';
    img.src = pics[currImg];
    currY = window.scrollY;
    updateCounter();
    window.addEventListener('scroll', noscroll);
}

function prevPic(){
    currImg--;
    
    if(currImg == -1){
        currImg = pics.length - 1;
    }

    img.src = pics[currImg];
    
    updateCounter();
}

function nextPic(){
    currImg++;
    
    if(currImg == pics.length){
        currImg = 0;
    }

    img.src = pics[currImg];
    updateCounter();
}

function updateCounter(){
    counter.innerHTML = currImg + 1 + " / " + pics.length;
}

function noscroll() {
    window.scrollTo(0, currY);
}

