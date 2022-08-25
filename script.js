const gameBoard = document.getElementById("gameboard");
const pacLand = document.getElementById("pac-land");
const ghostWorld = document.getElementById("ghost-world");

//Gameboard layers
let world = [];
let pacmen = [];
let ghosts = [];

//Game characteristics
let level = "easy";
let players = 1;
let isSuper = false;
let gamePlay = false;
let score = {
  current: 0,
  remaining: 0,
  winning: 0,
};

gameBoardSize();

function gameBoardSize() {
  const screen = document.querySelector(".screen");
  const layers = screen.querySelectorAll(".screen>div");
  const width = window.innerWidth * 0.29;
  const gameWidth = Math.round(width / 20) * 20;

  screen.style.width = gameWidth + 40 + "px";
  screen.style.height = gameWidth + 7 + "px";

  layers.forEach((el) => {
    el.style.width = gameWidth + "px";
    el.style.height = gameWidth + "px";
  });
}

function gameInit(level) {
  generateMap(level);
  generatePacLand();
  generateGhostWorld(level);
  setWinningScore();
  runGhosts();
}

//* Generate Map
function generateMap(difficulty) {
  // * enable gameplay
  gamePlay = true;

  // * clear gameboard classList
  gameBoard.className = "";

  level = difficulty;

  // * create empty world
  world = [];

  // * get container dimensions and divide by 20 (round down)
  const width = Math.floor(gameBoard.offsetWidth / 20);
  const height = Math.floor(gameBoard.offsetHeight / 20);
  let row = [];

  // * create row that matches width
  for (let i = 0; i < width; i++) {
    i === 0 || i + 1 === width ? row.push(2) : row.push(0);
  }

  // * create number of rows to match height
  for (let i = 0; i < height; i++) {
    world.push(row);
  }
  // * Initial map has only bricks on edges & empty spaces in the middle
  setBoundaries(world);

  // * Generate walls based on difficulty
  level === "hard" || level === "mushrooms"
    ? setRandomWalls()
    : level === "medium"
    ? setMediumWalls()
    : setLongWalls();
  // * Generate Cherries
  setCherries();
  // * Generate HTML
  mapHTML(world, gameBoard);
}

function setBoundaries(world) {
  for (let y = 0; y < world.length; y++) {
    world[y] =
      y === 0 || y + 1 === world.length
        ? (world[y] = world[y].map((x) => {
            return x === 2 ? (x = x) : (x = x + 2);
          }))
        : //Fill the remainder of the cells with coins
          (world[y] = world[y].map((x) => {
            return x === 2 ? (x = x) : (x = x + 1);
          }));
  }
}

function setRandomWalls() {
  // Wall seeds should never touch the edges so start incrementing on the third row(y)
  const limit = world.length - 2;
  for (let i = 2; i < limit; i++) {
    world[i] = world[i].map((row, loop) => {
      //Set a 30% chance of generating a wall seed
      const wallSeed = Math.random() > 0.3 ? true : false;

      //skip first and last values in array
      return (row =
        loop < 1 || loop + 1 === world[i].length
          ? 2
          : (row =
              loop === 1 || loop + 2 === world[i].length
                ? 1
                : wallSeed === false
                ? 2
                : 1));
    });
  }
  checkForOrphans();
}

function checkForOrphans() {
  for (let i = 0; i < world.length; i++) {
    const row = world[i];
    //Find a coin(1) with bricks(2) on either side
    orphanFinder(row, i);
  }
}

function orphanFinder(row, y) {
  for (let x = 0; x < row.length; x++) {
    //skip first and last two rows for analysis
    //skip first two and last two items in row
    if (y > 1 && y < row.length - 2 && x > 1 && x < row.length - 2) {
      //run position finder to update position object
      position = positionDetails(row, y, x);
      const sum =
        position.up.val +
        position.down.val +
        position.left.val +
        position.right.val;
      //if the sum of all the positions is 8, the coin is surrounded
      sum > 8 ? (world[y][x] = 2) : null;
    }
  }
}

function setMediumWalls() {
  setLongWalls();
  moreRandomBlocks();
  checkForOrphans();
}

function setLongWalls() {
  const numberAcross = Math.floor(Math.random() * 4) + 1;
  const divisor = world.length % 2 === 0 ? 3 : 2;

  for (let i = 1; i < world.length; i++) {
    world[i] =
      i > 1 && i < world.length - 2 && i % divisor === 0
        ? longWalls(world[i], numberAcross)
        : world[i];
  }
}
function longWalls(arr, num) {
  const wallLength = Math.floor(arr.length / num);
  let newRow = [];
  for (let i = 1; i < arr.length; i + wallLength) {
    const start = i;
    const end = i + wallLength;
    newRow.push(addBricks(arr.slice(start, end)));
    i = end;
  }
  newRow = newRow.flat();

  newRow[0] = 2;
  newRow[1] = 1;
  newRow[arr.length - 1] = 2;
  newRow[arr.length - 2] = 1;

  return newRow;
}

function addBricks(arr) {
  for (let i = 0; i < arr.length; i++) {
    i === arr.length - 1 ? (arr[i] = 1) : (arr[i] = 2);
  }
  return arr;
}

function moreRandomBlocks() {
  for (let y = 0; y < world.length; y++) {
    const row = world[y];
    if (y > 1 && y < world.length - 1) {
      let newRow = [];
      for (let x = 0; x < row.length; x++) {
        if (x > 1 && x < row.length - 1) {
          const position = positionDetails(row, y, x);
          //Set a 15% chance of generating a wall seed
          const brickPlace = Math.random() > 0.15 ? true : false;
          position.focus.val === 1 && position.up.val === 1
            ? brickPlace === false
              ? (row[x] = 2)
              : row[x]
            : null;
        }
      }
    }
  }
}

let position = {};
function positionDetails(row, y, x) {
  //clear position
  position = {};
  position.up = {
    x: x,
    y: y - 1,
    val: world[y - 1][x],
  };
  position.down = {
    x: x,
    y: y + 1,
    val: world[y + 1][x],
  };
  position.left = {
    x: x - 1,
    y: y,
    val: row[x - 1],
  };
  position.right = {
    x: x + 1,
    y: y,
    val: row[x + 1],
  };
  position.focus = {
    x: x,
    y: y,
    val: row[x],
  };

  return position;
}

function setCherries() {
  // Cherries are all ways in the 4 corners
  world[1][1] = 5;
  world[1][world.length - 2] = 5;
  world[world.length - 2][1] = 5;
  world[world.length - 2][world.length - 2] = 5;
}

function mapHTML(layer, target) {
  let HTML = "";
  let ghostCount = 1;
  for (let y = 0; y < layer.length; y++) {
    HTML += '<div class="row">';
    layer[y].map((row, x) => {
      row === 1
        ? (HTML += HTMLS(20, y, x, "coin"))
        : row === 2
        ? (HTML += HTMLS(-1, y, x, "brick"))
        : row === 3
        ? (HTML += HTMLS(null, y, x, null, "pacman", "data-pacman", "right"))
        : row === 4
        ? ((HTML += HTMLS(null, y, x, "ghost", null, "data-ghost", ghostCount)),
          ghostCount++)
        : row === 5
        ? (HTML += HTMLS(50, y, x, "cherries"))
        : row === 6
        ? (HTML += HTMLS(null, y, x, null, "twopac", "data-pacman", "left"))
        : (HTML += HTMLS(0, y, x));
    });
    HTML += "</div>";
  }

  target.innerHTML = HTML;
}

function HTMLS(
  score,
  y,
  x,
  elClass,
  id = null,
  dataArg = null,
  dataVal = null
) {
  let div = document.createElement("div");
  score ? div.setAttribute("data-score", score) : null;
  div.setAttribute("data-y", y);
  div.setAttribute("data-x", x);
  dataArg ? div.setAttribute(dataArg, dataVal) : null;
  elClass ? div.classList.add(elClass) : null;
  id ? div.setAttribute("id", id) : null;

  return div.outerHTML;
}

//Creates layer arrays to "mirror" the world array
function mirrorArray() {
  return [...Array(world.length)].flatMap((x) => [
    (x = [...Array(world.length)].map((x) => (x = 0))),
  ]);
}

function generatePacLand() {
  // * Create array to match shape of world array
  pacmen = mirrorArray();

  const available = worldTraverse(pacPlace);
  const location = selectLocationRandomly(available);

  //place pacman
  pacmen[location[0]][location[1]] = 3;
  //remove underlying world value
  world[location[0]][location[1]] = 0;
  players === 2 ? createTwopac() : null;

  mapHTML(pacmen, pacLand);
  //update world HTML
  mapHTML(world, gameBoard);
}

function createTwopac() {
  const available = worldTraverse(twoPacPlace);
  const location = selectLocationRandomly(available);
  //place pacman
  pacmen[location[0]][location[1]] = 6;
  //remove underlying world value
  world[location[0]][location[1]] = 0;
}

function generateGhostWorld(level) {
  // * Create array to match shape of world array
  ghosts = mirrorArray();

  const available = worldTraverse(ghostPlace);

  const numGhosts =
    level === "easy"
      ? 2
      : level === "medium"
      ? 3
      : level === "hard" || level === "mushrooms"
      ? 4
      : null;

  const quarters = quadrants();

  // * iterate through quadrant keys (q1,q2 ... )
  Object.keys(quadrants()).map((key, i) => {
    // * if iteration is less than number of ghosts, create a ghost
    i < numGhosts ? setGhostPoint(available, quarters[key]) : null;
  });

  mapHTML(ghosts, ghostWorld);
}

function setGhostPoint(coordinates, quarter) {
  let available = [];
  coordinates.map(([y, x], i) =>
    y > quarter.yStart &&
    y < quarter.yEnd &&
    x > quarter.xStart &&
    x < quarter.xEnd
      ? available.push([y, x])
      : null
  );

  const location = selectLocationRandomly(available);

  //place pacman
  ghosts[location[0]][location[1]] = 4;
}

function possPositions(func) {
  let results = [];
  let i = 0;
  for (let y = 0; y < world.length; y++) {
    const row = world[y];

    if (y > 1 && y < world.length - 1) {
      for (let x = 0; x < row.length; x++) {
        if (x > 1 && x < row.length - 1) {
          const coordinates = func(row, y, x);

          coordinates ? ((results[i] = coordinates), i++) : null;
        }
      }
    }
  }
  return results.flat();
}

//produces an array of available coordinates
function worldTraverse(func) {
  let coordinates = [];
  world.map(function (row, y) {
    row.map(function (col, x) {
      // * y = the row
      // * x = column positition
      // * y[x] = the cell value
      const result = func(y, x, world[y][x]);
      result
        ? coordinates.push(result)
        : //console.error("ERROR! check " + func)
          null;
    });
  });
  return coordinates;
}

function pacPlace(y, x, val) {
  const center = centerPoint();
  const range = percentageRange(0.1);
  const low = range.low - center.y;
  const high = range.high - center.y;
  if (y > low && y < high && x > low && x < high && val !== 2) {
    return [y, x];
  }
}

function pacGamePlayPlace(y, x, val) {
  const center = centerPoint();
  const range = percentageRange(0.2);
  const low = range.low - center.y;
  const high = range.high - center.y;
  if (y > low && y < high && x > low && x < high && val === 0) {
    return [y, x];
  }
}

function twoPacPlace(y, x, val) {
  const quad = quadrants();
  const low = quad.q4.yStart + 2;
  const high = quad.q4.yEnd - 6;
  if (y > low && y < high && x > low && x < high && val !== 2) {
    return [y, x];
  }
}

function ghostPlace(y, x, val) {
  let valid = 0;
  const quarters = quadrants();
  const yLow = Math.floor(quarters.q1.yEnd * 0.25),
    yHigh = Math.floor(quarters.q4.yEnd * 0.75),
    xLow = Math.floor(quarters.q1.xEnd * 0.25),
    xHigh = Math.floor(quarters.q4.xEnd * 0.75);

  for (let i = 0; i < 4; i++) {
    //are coordinates within +/- range of a given quarter center point
    i === 0
      ? y < yLow + 3 && x > xLow - 2 && x < xLow + 3
        ? valid++
        : valid
      : //are coordinates within +/-(2) range of q2 center point
      i === 1
      ? y < yLow + 3 && x > xHigh - 2 && x < xHigh + 2
        ? valid++
        : valid
      : //are coordinates within +/-(2) range of q3 center point
      i === 2
      ? y > yHigh - 1 && y < yHigh + 3 && x < xLow + 3
        ? valid++
        : valid
      : //are coordinates within +/-(2) range of q4 center point
      i === 3
      ? y > yHigh - 1 && y < yHigh + 6 && x > xHigh - 1 && x < xHigh + 3
        ? valid++
        : valid
      : //otherwise discard
        null;
  }
  //If the coordinates meet any of the above criteria and are not bricks or twopac, return as valid
  if (valid > 0 && val !== 2 && val !== 6) {
    return [y, x];
  }
}

function mushroomPlace(y, x, val) {
  const pac = document.getElementById("pacman");
  const pacY = parseInt(pac.dataset.y);
  const pacX = parseInt(pac.dataset.x);
  const lowY = pacY > 5 ? pacY - 4 : 1;
  const highY = pacY > world.length - 5 ? pacY + 4 : world.length - 1;
  const lowX = pacX > 5 ? pacX - 4 : 1;
  const highX = pacX > world[0].length - 5 ? pacX + 4 : world[0].length - 1;
  if (y > lowY && y < highY && x > lowX && x < highX && val !== 2) {
    return [y, x];
  }
}

function findGhostCoins(y, x, val) {
  const el = gameBoard.querySelector(
    '[data-y="' + y + '"][data-x="' + x + '"]'
  );
  const hasCoin = el.classList.contains("coin");

  if (val === 0 && hasCoin) {
    return [y, x];
  }
}

function centerPoint() {
  const centralY = Math.floor(world.length * 0.5);
  const centralX = Math.floor(world[0].length * 0.5);

  return { y: centralY, x: centralX };
}

function quadrants() {
  const center = centerPoint();
  const quarters = {
    q1: { yStart: 0, yEnd: center.y, xStart: 0, xEnd: center.x },
    q2: {
      yStart: 0,
      yEnd: center.y,
      xStart: center.x + 1,
      xEnd: world[0].length,
    },
    q3: { yStart: center.y + 1, yEnd: world.length, xStart: 0, xEnd: center.x },
    q4: {
      yStart: center.y + 1,
      yEnd: world.length,
      xStart: center.x + 1,
      xEnd: world[0].length,
    },
  };

  return quarters;
}

function percentageRange(percentage) {
  const range = Math.ceil(world.length * percentage);

  return { low: world.length - range, high: world.length + range };
}

function selectLocationRandomly(available) {
  return available[Math.floor(Math.random() * available.length)];
}

function setWinningScore() {
  const existing = parseInt(
    document.querySelector("#score span+span").innerHTML
  );
  let values = worldTraverse(worldValue);
  values = values.map((y) => (y === 1 ? 20 : y === 5 ? 50 : 0));
  const sum = values.reduce((b, a) => b + a, 0);

  score.winning = existing > 0 ? sum + existing : sum;
}

function worldValue(y, x, val) {
  return val === 1 || val === 5 ? val : 0;
}

function runGhosts() {
  const interval = level === "easy" ? 500 : level === "medium" ? 250 : 150;
  let run = setInterval(function () {
    if (gamePlay === false) {
      clearInterval(run);
    } else {
      moveGhosts();
    }
  }, interval);
}

function moveGhosts() {
  const ghosts = document.querySelectorAll(".ghost");

  for (const ghost of ghosts) {
    setCourse(ghost);
  }
}

function setCourse(ghost) {
  const y = parseInt(ghost.dataset.y);
  const x = parseInt(ghost.dataset.x);

  //Get values from adjacent squares
  const position = positionDetails(world[y], y, x);
  //Set possible move array
  let possibleMoves = [];
  //remove possible moves that are not available due to bricks

  const obj = Object.entries(position);
  for (let i = 0; i < 4; i++) {
    const direction = obj[i][0];
    const squareValue = obj[i][1].val;
    //remove possible moves where a brick, ghost
    squareValue !== 2 && squareValue !== 4
      ? possibleMoves.push(direction)
      : null;
  }
  //Select move direction at random
  const randomMove = Math.floor(Math.random() * possibleMoves.length);
  const move = possibleMoves[randomMove];

  const newCoordinates = position[move];
  redrawGhost(ghost, newCoordinates);
}

function redrawGhost(el, move) {
  updateGhostWorld(el, move);

  const killedAPac = pacCollision(move);

  //If killdAPac returns three stop the game, otherwise kill twopac and continue
  killedAPac ? (killedAPac === 3 ? stopGame(3) : killedATwopac()) : null;
}

function updateGhostWorld(el, move) {
  // * remove old position from array
  ghosts[el.dataset.y][el.dataset.x] = 0;
  //update ghosts array
  ghosts[move.y][move.x] = 4;

  const ghostType = el.dataset.ghost;

  //remove ghost class
  el.classList.remove("ghost");

  //remove ghost data attributes
  delete el.dataset.ghost;

  const newPosition = ghostWorld.querySelector(
    '[data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );

  //carry over ghost type data attribute from old position
  newPosition.dataset.ghost = ghostType;

  //add ghost class name
  newPosition.classList.add("ghost");
}

function pacCollision(move) {
  const pacSpot = pacmen[move.y][move.x];

  // IF not super and pacman array element is 3 or 6, return value
  return (!isSuper && pacSpot === 3) || pacSpot === 6 ? pacSpot : false;
}

document.onkeydown = checkKey;

function checkKey(e) {
  e = e || window.event;

  const pacMoves = [38, 40, 37, 39];
  const isPacman = pacMoves.includes(e.keyCode);
  const twoPacMoves = [87, 83, 65, 68];
  let isTwopac = twoPacMoves.includes(e.keyCode);

  //Don't return true if game is single player
  isTwopac = players === 2 ? isTwopac : false;

  //select HTML element to move based on truthy-ness of includes method above
  const el = isPacman
    ? document.getElementById("pacman")
    : isTwopac
    ? document.getElementById("twopac")
    : null;

  const direction = isPacman
    ? e.keyCode == "38"
      ? "up"
      : e.keyCode == "40"
      ? "down"
      : e.keyCode == "37"
      ? "left"
      : e.keyCode == "39"
      ? "right"
      : null
    : isTwopac
    ? e.keyCode == "87"
      ? "up"
      : e.keyCode == "83"
      ? "down"
      : e.keyCode == "65"
      ? "left"
      : e.keyCode == "68"
      ? "right"
      : null
    : null;

  gamePlay && direction ? movePacmen(direction, el) : null;
}

function movePacmen(direction, el) {
  // change data pacman to "animate" direction
  el.dataset.pacman = direction;

  // * get character's initial position
  const y = parseInt(el.dataset.y);
  const x = parseInt(el.dataset.x);

  // * get surrounding values
  const position = positionDetails(world[y], y, x);
  // * select value of desired move
  const desiredMove = position[direction];
  // * set boolean depending on whether value is 2
  const moveOK = determineMoveOkayness(position, desiredMove);

  // * if ok, redraw pacman or twopac
  moveOK
    ? redrawPacmen(el, position, position[direction], direction)
    : // * otherwise animate bump
      (playAudio("wallbump.mp3"), animateBump(el, position[direction]));
}

function redrawPacmen(el, position, move, direction) {
  //False means character is twopac
  const isPacman = el.id === "pacman";
  //3 = Pacman, 6 = Twopac
  const character = isPacman ? 3 : 6;

  //update the PacLand array
  pacMove(character, move, direction, el);

  !isSuper
    ? normalConsumption(isPacman, move)
    : superConsumption(move, position);
}

function normalConsumption(isPacman, move) {
  const worldValue = world[move.y][move.x];
  //If new position is a coin...
  /*
   * Update score by 20 points
   * Remove coin class & add empty
   */
  worldValue === 1
    ? (updateScore(20), munchModulo(), updateWorld(move, 0))
    : //If new position is a Cherry...
    /*
     * Update score by 50 points
     * Remove cherries class & add empty
     */
    worldValue === 5
    ? (updateScore(50), playAudio("eat_fruit.wav"), updateWorld(move, 0))
    : worldValue === 7
    ? initSuperPac()
    : null;

  const ghostValue = ghosts[move.y][move.x];
  //If new position is a Ghost...
  /*
   * STOP THE GAME
   */
  ghostValue === 4 ? (isPacman ? stopGame(3) : killedATwopac()) : null;
}

function superConsumption(move, position) {
  const surroundings = describeAllBlocks(position);

  for (const [key, value] of Object.entries(surroundings)) {
    const y = value.y;
    const x = value.x;
    const val = value.val;

    destroyBricks(y, x, val);
    eatStuff(value);
  }
}

function destroyBricks(y, x, val) {
  // Don't destroy outer bricks
  if (
    y === 0 ||
    x === 0 ||
    x === world[0].length - 1 ||
    y === world.length - 1
  ) {
    playAudio("bump.wav");
    return;
  }

  if (val === 2) {
    // select brick
    const brick = gameBoard.querySelector(
      '[data-y="' + y + '"][data-x="' + x + '"]'
    );
    //remove brick from world array
    world[y][x] = 0;
    //TODO: work on animation
    brick.classList.add("explode");
    playAudio("break.wav");
    setTimeout(() => {
      brick.classList.remove("explode", "brick");
    }, 100);
  }
}

function eatStuff(move) {
  const isGhost = checkGhostWorld(move);

  //eat coins and update score
  move.val === 1
    ? (updateScore(20), updateWorld(move, 0))
    : move.val === 5
    ? (updateScore(50), playAudio("eat_fruit.wav"), updateWorld(move, 0))
    : isGhost
    ? eatGhost(move)
    : null;
}

function removeGhostCoins() {
  const ghostCoins = worldTraverse(findGhostCoins);
  for (let i = 0; i < ghostCoins.length; i++) {
    const el = gameBoard.querySelector(
      '[data-y="' + ghostCoins[i][0] + '"][data-x="' + ghostCoins[i][1] + '"]'
    );
    el.className = "";
  }
}

function checkGhostWorld(move) {
  const ghostSpot = ghosts[move.y][move.x];

  return ghostSpot === 4 ? true : false;
}

function eatGhost(move) {
  playAudio("eat_ghost.wav");
  //remove from ghost array
  ghosts[move.y][move.x] = 0;

  //remove from Ghost HTML
  const ghost = ghostWorld.querySelector(
    '[data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );

  ghost.className = "";
  delete ghost.dataset.ghost;
}

function determineMoveOkayness(position, move) {
  //normal pac can't move through bricks
  let result = !isSuper ? move.val !== 2 : false;

  if (isSuper) {
    //if super pac runs into an outer wall, return false (can't move)
    //otherwise they can run through bricks;
    result =
      move.y === 0 ||
      move.x === 0 ||
      move.x === world[0].length - 1 ||
      move.y === world.length - 1
        ? false
        : true;
  }

  return result;
}

function describeAllBlocks(position) {
  /* ALL BLOCKS OBJ
   *  p1 p2 p3  *
   *  p4 😐 p5  *
   *  p6 p7 p8  *
   */
  const allBlocks = {
    p1: {
      x: position.up.x - 1,
      y: position.up.y,
      val: world[position.up.x - 1][position.up.y],
    },
    p2: position.up,
    p3: {
      x: position.up.x + 1,
      y: position.up.y,
      val: world[position.up.x + 1][position.up.y],
    },
    p4: position.left,
    p5: position.right,
    p6: {
      x: position.down.x - 1,
      y: position.down.y,
      val: world[position.down.x - 1][position.down.y],
    },
    p7: position.down,
    p8: {
      x: position.down.x + 1,
      y: position.down.y,
      val: world[position.down.x + 1][position.down.y],
    },
  };
  return allBlocks;
}

function animateBump(el, obj) {
  !isSuper ? el.classList.add("bump") : null;
  const direction = el.dataset.pacman;

  //if object was a brick
  if (obj.val === 2) {
    //find direction bumped
    const brick = gameBoard.querySelector(
      '[data-y="' + obj.y + '"][data-x="' + obj.x + '"]'
    );

    const classes = ["bump", `${direction}`];
    //add class
    brick.classList.add(...classes);

    //remove it after 100ms
    setTimeout(() => {
      brick.classList.remove(...classes);
      el.classList.remove("bump");
    }, 100);
  }
}
function updateScore(num) {
  score.current = score.current + num;
  score.remaining = score.winning - score.current;

  const el = document.querySelector("#score span:not(.description)");

  el.innerHTML = score.current;

  score.remaining < 1 || score.current >= score.winning
    ? stopGame(1)
    : mushroomsPlease();
}
let mushroomSet = false;
function mushroomsPlease() {
  //Set chance by difficulty
  const chance =
    level === "easy"
      ? 0.009
      : level === "medium"
      ? 0.01
      : level === "hard"
      ? 0.0
      : 0.1;
  const grow = Math.random() > chance ? false : true;

  !mushroomSet && grow ? (growMushroom(), (mushroomSet = true)) : null;
}

function growMushroom() {
  const available = worldTraverse(mushroomPlace);
  const location = selectLocationRandomly(available);
  world[location[0]][location[1]] = 7;

  const el = gameBoard.querySelector(
    '[data-y="' + location[0] + '"][data-x="' + location[1] + '"]'
  );
  el.className = "";
  el.classList.add("mushroom");
  playAudio("grow.wav");
}

let previousMunch = 0;
function munchModulo() {
  previousMunch % 2 === 0 ? playAudio("munch_1.wav") : playAudio("munch_2.wav");

  previousMunch++;
}

function playAudio(file) {
  var audio = new Audio("./assets/sounds/" + file);
  audio.pause();
  audio.volume = 0.25;
  audio.play();
}

function pacMove(who, move, direction, el) {
  // * remove old position from array
  pacmen[el.dataset.y][el.dataset.x] = 0;
  // * add new position to array
  pacmen[move.y][move.x] = who;

  //Update old pacman HTML element
  el.removeAttribute("id");
  // * remove super class if super
  isSuper ? el.classList.remove("super") : null;
  delete el.dataset.pacman;

  //Select new pacman HTML element
  const newPosition = pacLand.querySelector(
    '[data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );

  //Update new pacman HTML element
  who === 3
    ? newPosition.setAttribute("id", "pacman")
    : newPosition.setAttribute("id", "twopac");
  newPosition.dataset.pacman = direction;

  // * add super class if super
  isSuper ? newPosition.classList.add("super") : null;
}
function updateWorld(move, value) {
  world[move.y][move.x] = value;

  const spot = document.querySelector(
    '#gameboard [data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );
  spot.className = "";
  delete spot.dataset.score;
}

function stopGame(state) {
  gamePlay = false;

  state === 1
    ? pacWon()
    : state === 3
    ? pacmanDead()
    : state === 8
    ? superPacPlay()
    : null;
}

function pacWon() {
  gameBoard.classList.add("game-over");

  clearBoard();
  announceWin();

  setTimeout(() => {
    //Add to life meter
    lives.innerHTML += "1";
    gameInit(level);
  }, 1500);
}

function clearBoard() {
  const board = document.querySelectorAll("#gameboard>.row>div");
  for (let square = 0; square < board.length; square++) {
    const maxRow = board[board.length - 1].dataset.y;

    board[square].dataset.x !== "0" &&
    board[square].dataset.x !== maxRow &&
    board[square].dataset.y !== "0" &&
    board[square].dataset.y !== maxRow
      ? (board[square].className = "")
      : null;
  }
}

function announceWin() {
  playAudio("win.wav");
  let el = document.createElement("div");
  el.classList.add("announcement");
  el.innerHTML = "<h2>You Won!</h2>";
  gameBoard.prepend(el);
}

function announceGameOver() {
  let el = document.createElement("div");
  el.classList.add("announcement");
  el.innerHTML = "<h2>GAME OVER</h2>";
  gameBoard.prepend(el);
  setTimeout(() => {
    playAudio("game_over.wav");
  }, 1000);
  setHighScores();
}

function pacmanDead() {
  const el = document.getElementById("pacman");

  el.classList.add("dead");
  delete el.dataset.pacman;
  playAudio("death_1.wav");
  gameBoard.classList.add("pacman-dead");

  removeLife(el);
}

function removeLife(el) {
  const lifeMeter = document.getElementById("lives");
  const lifeValue = lifeMeter.innerHTML.match(/1/g);

  //If there are lives left
  /*
   * Remove a life
   * Place Pacman
   */
  lifeValue !== null
    ? ((lifeMeter.innerHTML = lifeMeter.innerHTML.slice(0, -1)), restartGame())
    : // If lives are 0
      /*
       * Run game over animation
       */
      gameOver(lifeMeter);
}

function gameOver(lives) {
  gameBoard.classList.add("game-over");
  const pacEl = document.getElementById("pacman");

  pacEl.classList.add("dead");
  clearBoard();
  announceGameOver();
  clearScore();

  setTimeout(() => {
    pacEl.removeAttribute("id");

    //Reset life meter
    lives.innerHTML = "111";
  }, 1500);
}

function restartGame() {
  setTimeout(() => {
    removePacman(3);
  }, 800);
  setTimeout(() => {
    pacResurrection();
    runGhosts();
    gamePlay = true;
  }, 1500);
}

function removePacman(pac) {
  gameBoard.classList.remove("pacman-dead");

  const el =
    pac === 3
      ? document.getElementById("pacman")
      : document.getElementById("twopac");

  el.removeAttribute("id");
  el.className = "";
  delete el.dataset.pacman;

  //remove from world array
  pacmen[el.dataset.y][el.dataset.x] = 0;
}

function pacResurrection() {
  const available = worldTraverse(pacGamePlayPlace);
  const location = selectLocationRandomly(available);

  //place pacman
  pacmen[location[0]][location[1]] = 3;

  const newPosition = pacLand.querySelector(
    '[data-y="' + location[0] + '"][data-x="' + location[1] + '"]'
  );

  newPosition.setAttribute("id", "pacman");
  playAudio("death_2.wav");
}

let recent = 0;
const delay = 20;
function killedATwopac() {
  //debounce
  if (recent >= Date.now() - delay) {
    console.log("debounce");
    return;
  }
  //switch to single player mode to prevent further movement
  players = 1;

  const el = document.getElementById("twopac");
  el.classList.add("dead");
  playAudio("death_1.wav");
  gameBoard.classList.add("pacman-dead");

  setTimeout(() => {
    removePacman(6);

    const twopacLives = document.querySelector(".lives .twopac");
    const lifeValue = twopacLives.innerHTML.match(/1/g);

    // * re-enable two player mode

    lifeValue !== null
      ? ((twopacLives.innerHTML = twopacLives.innerHTML.slice(0, -1)),
        twoPacs())
      : // If lives are 0, revert to single player mode
        (players = 1);
  }, 1500);
}

function onePac() {
  //if there were two players, we need to do clean up
  players === 2 ? revokeTwopac() : null;

  //Set players to 1
  players = 1;
}

function twoPacs() {
  //If this is the first time
  const hasLives = document.querySelector(".lives .twopac");
  !hasLives ? setTwopacLives() : null;

  // * re-enable two player mode
  players = 2;
  //If game is ongoing, draw twopac immediately
  if (gamePlay === true) {
    //place twopac in world array
    const available = worldTraverse(twoPacPlace);
    const location = selectLocationRandomly(available);
    //place pacman
    pacmen[location[0]][location[1]] = 6;
    //draw twopac
    invokeTwoPac(location);
  }
}

function setTwopacLives() {
  const el = document.querySelector(".lives .player-2");
  el.innerHTML += '<div class="twopac">111</div>';
}

function invokeTwoPac(loc) {
  const newPosition = pacLand.querySelector(
    '[data-y="' + loc[0] + '"][data-x="' + loc[0] + '"]'
  );

  newPosition.setAttribute("id", "twopac");
  playAudio("death_2.wav");
}

function revokeTwopac() {
  const el = document.getElementById("twopac");

  //reset HTML
  el ? (el.removeAttribute("id"), delete el.dataset.pacman) : null;

  //remove twopac from world array
  pacmen[el.dataset.y][el.dataset.x];

  //remove lives
  document.querySelector(".lives .twopac").remove();
}

function setHighScores() {
  const score = document.querySelector("#score>span+span");
  const value = parseInt(score.innerHTML);

  const highScores = document.querySelectorAll("#high-scores li");
  let scoreArray = [value];
  if (highScores) {
    for (let i = 0; i < highScores.length; i++) {
      const highScore = parseInt(highScores[i].innerHTML);
      scoreArray.push(highScore);
    }
  }
  //Sort numbers descending
  scoreArray = scoreArray.sort(function (a, b) {
    return b - a;
  });

  const target = document.querySelector("#high-scores ul");
  target.innerHTML = "";
  for (let i = 0; i < scoreArray.length; i++) {
    const score = scoreArray[i];
    target.innerHTML += "<li>" + score + "</li>";
  }
}

function clearScore() {
  score = {
    current: 0,
    remaining: 0,
    winning: 0,
  };
  const scoreHTML = document.querySelector("#score>span:last-of-type");

  scoreHTML.innerHTML = 0;
}

function initSuperPac() {
  stopGame(8);
  generateSuperPac();
}
function generateSuperPac() {
  const pac = document.getElementById("pacman");

  // * clear mushroom
  world[pac.dataset.y][pac.dataset.x] = 0;
  const mushroom = gameBoard.querySelector(
    '[data-y="' + pac.dataset.y + '"][data-x="' + pac.dataset.x + '"]'
  );
  mushroom.className = "";

  pac.classList.add("super", "start");
  setTimeout(() => {
    pac.classList.remove("start");
  }, 1050);
  playAudio("super.wav");
}

function superPacPlay() {
  setTimeout(() => {
    gamePlay = true;
    runGhosts();
    //Set super status to true for 5 seconds
    tempSuperStatus(5000);
  }, 500);
}

function tempSuperStatus(time) {
  isSuper = true;
  playAudio("power_pellet.mp3");
  setTimeout(() => {
    const pac = document.getElementById("pacman");

    pac.classList.add("end");
    gamePlay = false;
    setTimeout(() => {
      pac.classList.remove("end", "super");
      gamePlay = true;
      runGhosts();
      mushroomSet = false;
    }, 500);
    playAudio("shrink.wav");
    superFalse();
    //Fixes issue where movement was too quick to remove coin class
    removeGhostCoins();
    //Replace ghosts
    checkForGhosts();
    //Update winning score
    setWinningScore();
  }, time);
}

function superFalse() {
  isSuper = false;
}

function checkForGhosts() {
  const ghosts = document.querySelectorAll(".ghost");

  !ghosts.length ? (generateGhostWorld(level), runGhosts()) : null;
}
