let music = document.getElementById("bandcamp");
let currSection = 0;
let sections = [
    "banner",
    "about",
    "music",
    "media",
    "contact"
];

function scrollDown(id){
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
        if(shortest < 3){
            newSection--;
        }
    }

    currSection = newSection;
}