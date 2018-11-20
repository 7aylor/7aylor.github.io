const music = document.getElementById("bandcamp");
let currSection = 0;
let sections = [
    "banner",
    "about",
    "music",
    "media",
    "events",
    "contact"
];

const upBtn = document.getElementById("up-btn");
const downBtn = document.getElementById("down-btn");
showScrollButtons();

window.onscroll = () => {
    showScrollButtons();
}

function showScrollButtons(){
    if(window.scrollY == 0){
        
        upBtn.style.display = 'none';
        downBtn.style.display = 'block';
    }
    else if(window.scrollY + window.innerHeight >= document.body.scrollHeight - 1){
        downBtn.style.display = 'none';
        upBtn.style.display = 'block';
    }
    else{
        upBtn.style.display = 'block';
        downBtn.style.display = 'block';
    }
}

function scrollDown(id){
    window.scrollTo( 0, 1 );
    document.getElementById(id.toString()).scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
    updateCurrSection(id);
}

function scrollDownOne(){
    if(currSection < sections.length - 1){
        currSection++;
    }
    document.getElementById(sections[currSection]).scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
}

function scrollUpOne(){
    if(currSection > 0){
        getClosestSection(true);   
    }
    document.getElementById(sections[currSection]).scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"});
}

function updateCurrSection(id){
    for(let i = 0; i < sections.length; i++){
        if(sections[i] == id){
            currSection = i;
            return;
        }
    }
}

window.addEventListener("scroll", function() {
    getClosestSection();
});


function getClosestSection(up){
    let yPos = window.scrollY;
    let shortest = document.body.clientHeight;
    let newSection = 0;
    for(let i = 0; i < sections.length; i++){
        let val = yPos - document.getElementById(sections[i]).offsetHeight * i;
        //console.log(sections[i] + " " + val);
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