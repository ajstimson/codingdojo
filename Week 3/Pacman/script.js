// TODO: Generate World map
/* example: 
const world = [
    [2,2,2,2,2,2,2,2,2,2]
    [2,1,2,1,1,1,1,1,1,2]
    [2,1,2,1,2,2,2,1,1,2]
    [2,1,2,1,2,1,2,1,1,2]
    [2,1,2,1,2,1,2,1,1,2]
    [2,1,2,2,2,1,2,1,1,2]
    [2,1,1,1,1,1,2,1,1,2]
    [2,1,1,1,1,1,2,1,1,2]
    [2,1,1,1,1,1,1,1,1,2]
    [2,2,2,2,2,2,2,2,2,2]
]
*/

//TODO: Generate HTML from World Map
    //TODO: Allow for randomly generated worlds
    /*  
        IDEAS:
        * Get screen width and divide by 20 (round down)
            That will give us the length of each world array
        * Get screen height and subtract space for score (also round down)
            That will give us number of rows to create
    */
//TODO: Create "wall templates" so that walls are contiguous
    /* 
        IDEAS:
        * Initial world has only 2(brick) & 0(empty)
        * Never touch the borders (borders are 1 and last row and first and last value of each row in between)
        * create "seed" positions from which a wall will be built
        * from a given seed, either build 3 left or 3 down
    */

//TODO: Create Pacman coordinate system
    //TODO: Create onkeydown movement for pacman
        //TODO: Implement collision detection
        /* 
            IDEAS:
            * If keydown would move pacman to world coordinate with a 2(brick)...
                go one "step" back in pacman coordinate system & 
                break onkeydown function
        */

//TODO: Implement Score system

//TODO: Create Ghosts
    /* 
        IDEAS:
        * Create type 3 block
        * Put it in opposite corner of map
    */
//TODO: Set random movement
    /* 
        IDEAS:
        * Map which directions are 1 or 0 and allow random selection of available options
    */
//TODO: Create Pacman lives
    //TODO: When Pacman and Ghost on same square, packman dies and loses a life
        /* 
            IDEAS:
            * When Pacman is on a 3 value block a few things should happen
                * ghost should stop (not sure how to do this)
                * Pacman coordinates can't change (keydown does nothing)
                * Death animation ?
                * Life goes down
                * World get's regenerated 
        */
    //TODO: Create Game Over
        //TODO: Create High Score records

//TODO: Create button to add a different pacman
    //TODO: figure out how to make them move
