const BOT_ROW_Y: number = 140; 
const TOP_ROW_Y: number = 70;

export type Box = {
    // (x,y) is the top-left coordinate of box
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Point = {
    x: number;
    y: number;
};

function boxesCollide(box1: Box, box2: Box): boolean {
    // Helper function to detect whether two boxes collide or not, you'll probably need this at some point
    let collidingFromBeg = box1.x >= box2.x && box1.x <= (box2.x + box2.width);
    let collidingFromEnd = (box1.x + box1.width) >= box2.x && (box1.x + box1.width) <= (box2.x + box2.width);

    let collidingHorizontally =  collidingFromBeg || collidingFromEnd;
    let collidingVertically =  box1.y == box2.y; 

    return collidingHorizontally;
}

function nextAvailableX(row: Box[], box: Box): number {
    if(row.length == 0)
        return box.x;

    for (let i = 0; i < row.length; i++)
    {
        if(i == row.length - 1)
            break;

        let collideWithNextBox: Boolean = boxesCollide(box, row[i + 1])

        let collideWithCurrentBox: Boolean = boxesCollide(box, row[i])

        if(collideWithNextBox)
            continue;

        let nextX: number = row[i].x + row[i].width; 
        // we dont want it to go backwards only forwards
        if(nextX <= box.x)
            continue;

        return nextX;
    }

    //return last available x
    return row[row.length-1].x + row[row.length-1].width;
}

/**
 * Finds the closest position (to boxToPlace.x and boxToPlace.y) where we can place boxToPlace:
 * - without colliding with any of the boxes.
 * - fitting inside insideContainer
 *
 * @param insideContainer A Box describing the area in which NameTags must be rendered. The returned position-Box must fall inside this Box
 * @param boxToPlace A Box describing the width and height of the NameTag we want to place, and the ideal coordinates we want to place it closest to
 * @param boxes Other Boxes, with which the returned position-box cannot collide
 */
export function getClosestFreePosition(
    insideContainer: Box,
    boxToPlace: Box, //where its going to be not where it is now
    boxes: Box[]
): Point {
    // Well, we kind of got stuck here! For now, I'm just retur  ning `boxToPlace` and therefor position
    // it at exactly the position requested. But this doesn't take into account any of the other boxes
    // Can you create a smarter layouting algorithm?

    // You can add any methods to this file to complete the exercise (no need to modify any other files) 

    if(boxes.length == 0)
        return boxToPlace;


    //will we collide with any box in general
    let colliding: boolean = false;
    for (let i = 0; i < boxes.length; i++)
    {
        if(boxesCollide(boxToPlace, boxes[i])) {
            colliding = true;
            break;
        }
    }
    //if we arent then move it
    if(!colliding)
        return boxToPlace;


    let topRowBoxes:Box[] = [];
    let botRowBoxes:Box[] = [];

    //checking next available position in top and bottom row
    boxes.forEach( (box) => {
        if(box.y == TOP_ROW_Y)
            topRowBoxes.push(box);
        if(box.y == BOT_ROW_Y)
            botRowBoxes.push(box);
    });

    //next available x's
    var nextTopX: number = nextAvailableX(topRowBoxes, boxToPlace);
    var nextBotX: number = nextAvailableX(botRowBoxes, boxToPlace);

    if(nextTopX == nextBotX)
    {
        //if in top row leave it there
        if (boxToPlace.y == TOP_ROW_Y) {
            boxToPlace.x = nextTopX;
            boxToPlace.y = TOP_ROW_Y;
        }
        else {
            //otherwise place in bottom row
            boxToPlace.x = nextBotX;
            boxToPlace.y = BOT_ROW_Y;
        }
    } else if(nextTopX < nextBotX)
    {
        boxToPlace.x = nextTopX;
        boxToPlace.y = TOP_ROW_Y;
    } else {
        boxToPlace.x = nextBotX;
        boxToPlace.y = BOT_ROW_Y;
    }

    return boxToPlace;
}