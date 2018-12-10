/*holds the images in the gallery. Try to follow format below. Place image in gallery folder
then update this array.*/
const pics = [
    /*"../img/gallery/gallery_live.jpg",
    "../img/gallery/gallery_stage.jpg",
    "../img/gallery/gallery_stage_all.jpg",
    "../img/gallery/gallery_playing.jpg",
    "../img/gallery/gallery_portrait.jpg",*/
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_live.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_playing.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_portrait.jpg?raw=true",
    "https://github.com/7aylor/7aylor.github.io/blob/master/Paul%20Quillen%20Website/img/gallery/gallery_stage.jpg?raw=true"    
];

//get elements on the page
const exitBtn = document.getElementById("exit");
const gallery = document.getElementById("gallery");
const leftArr = document.getElementById("left-arrow");
const rightArr = document.getElementById("right-arrow");
const counter = document.getElementById("counter");
const img = document.getElementById("gallery-img");

let currImg = 0; //keeps track of current img in the array being displayed
let currY = 0; //used to lock y position when gallery is active
let canClickArrow = false;

//called when X is pressed to exit gallery
function exitGallery(){
    "use strict";
    window.removeEventListener("scroll", noscroll);
    upBtn.style.display = "block";
    downBtn.style.display = "block";
    gallery.style.display = "none";
}

//called from the gallery link in media section
function openGallery(){
    "use strict";
    gallery.style.display = "block";
    img.src = pics[currImg];
    currY = window.scrollY;
    window.addEventListener("scroll", noscroll);
    upBtn.style.display = "none";
    downBtn.style.display = "none";

    //wait for image to load before allowing another click,
    //not using arrow function because ie doesn't support it
    img.onload = function() { updateCounterAndCanClick(); }
}

//called from prev arrow being clicked. Decrements image counter and updates displaying image
function prevPic(){
    "use strict";
    if(canClickArrow == true){
        canClickArrow = false;
        currImg--;
        
        if(currImg == -1){
            currImg = pics.length - 1;
        }

        img.src = pics[currImg];

        //wait for image to load before allowing another click
        img.onload = function() { updateCounterAndCanClick(); }
    }
}

//called from next arrow being clicked. Increments image counter and updates displaying image
function nextPic(){
    "use strict";
    if(canClickArrow == true){
        canClickArrow = false;
        currImg++;
        
        if(currImg == pics.length){
            currImg = 0;
        }
    
        img.src = pics[currImg];

        //wait for image to load before allowing another click
        img.onload = function() { updateCounterAndCanClick(); }
    }
}

//updates current image counter and condition to allow clicking next/prev arrows
function updateCounterAndCanClick(){
    "use strict";
    counter.innerHTML = currImg + 1 + " / " + pics.length;
    canClickArrow = true;
}

//locks Y scrolling
function noscroll() {
    "use strict";
    window.scrollTo(0, currY);
}

