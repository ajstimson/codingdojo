const gameBoard = document.getElementById("gameboard");
let world = [];
gameBoardSize();

function gameBoardSize() {
  //const width = 200;
  const width = window.innerWidth * 0.33;
  const gameWidth = Math.round(width / 20) * 20;

  document.querySelector("main").style.width = gameWidth + 7 + "px";
  document.querySelector(".wrap").style.height = gameWidth + 7 + "px";
  gameBoard.style.width = gameWidth + "px";
  gameBoard.style.height = gameWidth + "px";
}

//* Generate Map
function generateMap() {
  world = [];
  // Get container dimensions and divide by 20 (round down)
  const width = Math.floor(gameBoard.offsetWidth / 20);
  const height = Math.floor(gameBoard.offsetHeight / 20);
  let row = [];

  // Create row that matches width
  for (let i = 0; i < width; i++) {
    i === 0 || i + 1 === width ? row.push(2) : row.push(0);
  }

  // Create number of rows to match height
  for (let i = 0; i < height; i++) {
    world.push(row);
  }
  // * Initial map has only bricks on edges & empty spaces in the middle
  setBoundaries(world);

  // * Set down walls for fun!
  setWalls(world);

  // * Generate HTML
  mapHTML(world);
}

function setBoundaries(world) {
  for (let i = 0; i < world.length; i++) {
    world[i] =
      i === 0 || i + 1 === world.length
        ? (world[i] = world[i].map((row) => {
            return row === 2 ? (row = row) : (row = row + 2);
          }))
        : //Fill the remainder of the cells with coins
          (world[i] = world[i].map((row) => {
            return row === 2 ? (row = row) : (row = row + 1);
          }));
  }
}

function setWalls(world) {
  setWallSeeds(world);
  checkForOrphans(world);
}

function setWallSeeds(world) {
  // Wall seeds should never touch the edges so start incrementing on the third layer
  const limit = world.length - 2;
  for (let i = 2; i < limit; i++) {
    world[i] = world[i].map((row, j) => {
      //Set a 25% chance of generating a wall seed
      const wallSeed = Math.random() > 0.2 ? true : false;

      //skip first and last values in array
      return (row =
        j < 1 || j + 1 === world[i].length
          ? 2
          : (row =
              j === 1 || j + 2 === world[i].length
                ? 1
                : wallSeed === false
                ? 2
                : 1));
    });
  }
}

function checkForOrphans(world) {
  for (let i = 0; i < world.length; i++) {
    const row = world[i];
    //Find a 1 with 2 on either side
    possibleOrphans = orphanFinder(row, i);
  }
}

function orphanFinder(arr, row) {
  for (let i = 0; i < arr.length; i++) {
    //skip first and last two rows for analysis
    //skip first two and last two items in row
    if (row > 1 && row < arr.length - 2 && i > 1 && i < arr.length - 2) {
      //check if values are odd or even
      let position = {};
      const item = arr[i];
      position.above = world[row - 1][i];
      position.below = world[row + 1][i];
      position.left = arr[i - 1];
      position.right = arr[i + 1];

      const values = Object.values(position);

      const sum = values.reduce((acc, value) => {
        return acc + value;
      }, 0);

      //if the sum of all the positions is 8, the coin is surrounded
      sum === 8 ? removeOrphan(row, i) : null;
    }
  }
}

function removeOrphan(row, index) {
  //replace orphan with a brick
  world[row][index] = 2;
}

function mapHTML(world) {
  let HTML = "";
  for (let i = 0; i < world.length; i++) {
    HTML += '<div class="row">';
    world[i].map((row) => {
      row === 2
        ? (HTML += '<div class="brick"></div>')
        : row === 1
        ? (HTML += '<div class="coin"></div>')
        : (HTML += '<div class="empty"></div>');
    });
    HTML += "</div>";
  }

  gameBoard.innerHTML = HTML;
}

/*
        IDEAS:
        *
        *
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
