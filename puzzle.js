
var rows = 3;
var columns = 3;

var currTile;
var otherTile;

var turns = 0;

var imgOrderComplete = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
// var imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
localStorage['isCompleted'] = 'no';
var statNow = false;

function myOnloadFunction(){
    document.getElementById("board").innerHTML = '';
    if(localStorage['isCompleted'] == 'no'){
        turns = 0;
        document.getElementById("turns").innerText = turns;
        for (let r=0; r < rows; r++) {
            for (let c=0; c < columns; c++) {
                let imgKey = 3*r+c;
                let tile = document.createElement("img");
                tile.id = r.toString() + "-" + c.toString();
                tile.src = imgOrder[imgKey] + ".jpg";
    
                //DRAG FUNCTIONALITY
                tile.addEventListener("dragstart", dragStart);  //click an image to drag
                tile.addEventListener("dragover", dragOver);    //moving image around while clicked
                tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
                tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
                tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
                tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles

                tile.addEventListener("touchstart", handleTouchStart);
    
                document.getElementById("board").append(tile);
                document.getElementById("turns-space").style.display = 'block';
                document.getElementById("tip").style.display = 'block';
                document.getElementById("completed").style.display = 'none';
                document.getElementById("button-space").style.display = 'none';
            }
        }
    }
    else{
        for (let r=0; r < rows; r++) {
            for (let c=0; c < columns; c++) {
                let imgKey = 3*r+c;
                let tile = document.createElement("img");
                tile.id = r.toString() + "-" + c.toString();
                tile.src = imgOrderComplete[imgKey] + ".jpg";
    
                document.getElementById("board").append(tile);
                document.getElementById("turns-space").style.display = 'none';
                document.getElementById("tip").style.display = 'none';
                document.getElementById("completed").style.display = 'block';
                document.getElementById("button-space").style.display = 'inline-flex';
            }
        }
    }
}

window.onload = myOnloadFunction;

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!otherTile.src.includes("1.jpg")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r == r2 && c2 == c-1;
    let moveRight = r == r2 && c2 == c+1;

    let moveUp = c == c2 && r2 == r-1;
    let moveDown = c == c2 && r2 == r+1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = turns;
    }

    statNow = checkComplete();

    if(statNow){
        disabledAllTiles();
        puzzleCompleted();
    }
}

function checkComplete() {
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {
            let imgName = 3*r+c+1;
            let tile = document.getElementById(r+"-"+c);
            let pathNow = tile.src;
            const pathArray = pathNow.split("/");
            let imgNow = pathArray[pathArray.length - 1]
            let imgComplete = imgName + ".jpg";

            if(imgNow !== imgComplete){
                return false;
            }
        }
    }

    return true;
}

function disabledAllTiles() {
    for (let r=0; r < rows; r++) {
        for (let c=0; c < columns; c++) {
            let tile = document.getElementById(r+"-"+c);

            tile.removeEventListener("dragstart", dragStart);
            tile.removeEventListener("dragover", dragOver);
            tile.removeEventListener("dragenter", dragEnter);
            tile.removeEventListener("dragleave", dragLeave);
            tile.removeEventListener("drop", dragDrop);
            tile.removeEventListener("dragend", dragEnd);

            tile.removeEventListener("touchstart", handleTouchStart);
            tile.draggable = false;
        }
    }
}

function puzzleCompleted(){
    localStorage['isCompleted'] = 'yes';
    myOnloadFunction();
}

function playAgain(){
    localStorage['isCompleted'] = 'no';
    myOnloadFunction();
}

function handleTouchStart(e) {
    e.preventDefault();

    let idImage = e.target.id;
    let currCoords = idImage.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let moved = false;
    //coor up
    if(r-1 >= 0 && !moved){
        let rUp = r-1;
        let cUp = c;

        let coorUp = rUp+"-"+cUp;
        let tileUp = document.getElementById(coorUp);
        if (tileUp.src.includes("1.jpg")) {
            let tileUpPrior = tileUp.src;
            let tileTouched = e.target.src;
            tileUp.src = tileTouched;
            e.target.src = tileUpPrior;
            moved = true;
        }
    }

    //coor down
    if(r+1 <= rows && !moved){
        let rDown = r+1;
        let cDown = c;

        let coorDown = rDown+"-"+cDown;
        let tileDown = document.getElementById(coorDown);
        if (tileDown.src.includes("1.jpg")) {
            let tileDownPrior = tileDown.src;
            let tileTouched = e.target.src;
            tileDown.src = tileTouched;
            e.target.src = tileDownPrior;
            moved = true;
        }
    }

    //coor left
    if(c-1 >= 0 && !moved){
        let rLeft = r;
        let cLeft = c-1;

        let coorLeft = rLeft+"-"+cLeft;
        let tileLeft = document.getElementById(coorLeft);
        if (tileLeft.src.includes("1.jpg")) {
            let tileLeftPrior = tileLeft.src;
            let tileTouched = e.target.src;
            tileLeft.src = tileTouched;
            e.target.src = tileLeftPrior;
            moved = true;
        }
    }

    //coor right
    if(c+1 <= columns && !moved){
        let rRight = r;
        let cRight = c+1;

        let coorRight = rRight+"-"+cRight;
        let tileRight = document.getElementById(coorRight);
        if (tileRight.src.includes("1.jpg")) {
            let tileRightPrior = tileRight.src;
            let tileTouched = e.target.src;
            tileRight.src = tileTouched;
            e.target.src = tileRightPrior;
            moved = true;
        }
    }

    if(moved){
        turns += 1;
        document.getElementById("turns").innerText = turns;

        statNow = checkComplete();

        if(statNow){
            disabledAllTiles();
            puzzleCompleted();
        }
    }
}

