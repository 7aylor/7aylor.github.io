function clearMapPos(x, y){
    map[x][y] = "grass";
}

function checkValidMapPos(x, y){

    if(x >= 0 && x < NUM_COLSROWS && y >= 0 && y < NUM_COLSROWS){
        if(obstacles.includes(map[x][y])){
            return false;
        }
        return true;
    }
}

function getRock(x, y){
    for(var i = 0; i < rocks.length; i++){
        if(rocks[i].getRockByCoord(x, y) == 1){
            return rocks[i];
        }
    }
}

function removeItemFromArray(arr, item){
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == item){
            arr.splice(item, 1);
        }
    }
    console.log(arr);
}