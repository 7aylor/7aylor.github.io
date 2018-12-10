//get elements in html and store in vars
const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");
const body = document.getElementsByTagName("body");
const music = document.getElementById("bandcamp");

//array to hold page sections, needs to be in order they appear in html
const sections = [
    "banner",
    "about",
    "music",
    "events",
    "media",
    "contact"
];

// Chrome 1+
const isChrome = !!window.chrome && !!window.chrome.webstore;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== "undefined";


let enableScrolling = false; //used to enable scrolling buttons if on chrome or firefox
let currSection = 0; //keeps track of which section we are in related to the array

//initially call to hide/show scroll buttons on proper browsers
showScrollButtons();

//when page loads, check if firefox/chrome to enable buttons when ready to scroll
window.onload = function () {
    if(isChrome || isFirefox){
        enableScrolling = true;
        upBtn.parentNode.style.display = "block";
        downBtn.parentNode.style.display = "block";
    }
};

//when user scrolls mouse wheel, check which buttons should show
window.onscroll = function() {
    if(enableScrolling){
        getClosestSection();
        showScrollButtons();
        console.log("scrolling");
    }
};

//determines which scroll buttons should display on the page, top, bottom, or both depending on screen position Y
function showScrollButtons(){
    if(window.scrollY == 0){
        upBtn.style.display = "none";
        downBtn.style.display = "block";
    }
    else if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 1){
        downBtn.style.display = "none";
        upBtn.style.display = "block";
    }
    else{
        upBtn.style.display = "block";
        downBtn.style.display = "block";
    }
}

//called from navbar buttons
function scrollDown(id){
    document.getElementById(id.toString()).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    updateCurrSection(id);
}

//called from down button onclick
function scrollDownOne(){
    if(currSection < sections.length - 1){
        currSection++;
    }
    document.getElementById(sections[currSection]).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

//called from up button on click
function scrollUpOne(){
    if(currSection > 0){
        getClosestSection(true);   
    }
    document.getElementById(sections[currSection]).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
}

//updates currSection var to the section in the array
function updateCurrSection(id){
    for(let i = 0; i < sections.length; i++){
        if(sections[i] == id){
            currSection = i;
            return;
        }
    }
}

//get closest section based on y position
function getClosestSection(up){
    let yPos = window.scrollY;
    let shortest = document.body.clientHeight;
    let newSection = 0;
    for(let i = 0; i < sections.length; i++){
        let val = yPos - document.getElementById(sections[i]).offsetHeight * i;
        if(Math.abs(val) < shortest){
            if(val < 0){
                newSection = i - 1;
            }
            else{
                newSection = i;
            }
            shortest = Math.abs(val);
        }
    }

    if(up == true){
        if(shortest < 20){
            newSection--;
        }
    }

    currSection = newSection;
}