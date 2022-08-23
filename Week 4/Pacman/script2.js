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

//GameAgent global scope variables
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

  screen.style.width = gameWidth + 7 + "px";
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
}

//* Generate Map
function generateMap(level) {
  // * enable gameplay
  gamePlay = true;

  // * clear gameboard classList
  gameBoard.className = "";

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
  level === "hard"
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
  console.log(available);
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
    level === "easy" ? 2 : level === "medium" ? 3 : level === "hard" ? 4 : null;

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
  let values = worldTraverse(worldValue);
  values = values.map((y) => (y === 1 ? 20 : y === 5 ? 50 : 0));
  const sum = values.reduce((b, a) => b + a, 0);

  score.winning = sum;
}

function worldValue(y, x, val) {
  return val === 1 || val === 5 ? val : 0;
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
  const moveOK = desiredMove.val !== 2;

  // * if ok, redraw pacman or twopac
  moveOK
    ? redrawPacmen(el, position[direction], direction)
    : // * otherwise animate bump
      (playAudio("wallbump.mp3"), animateBump(el, position[direction]));
}

function redrawPacmen(el, move, direction) {
  //False means character is twopac
  const isPacman = el.id === "pacman";
  //3 = Pacman, 6 = Twopac
  const character = isPacman ? 3 : 6;

  //update the PacLand array
  updatePacLand(character, move, direction, el);

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
    : null;

  const ghostValue = ghosts[move.y][move.x];
  //If new position is a Ghost...
  /*
   * STOP THE GAME
   */
  ghostValue === 4 ? (isPacman ? stopGame(squareValue) : killTwopac()) : null;
}

function animateBump(el, obj) {
  el.classList.add("bump");
  const direction = el.dataset.pacman;

  //if object was a brick
  if (obj.val === 2) {
    //find direction bumped
    const brick = document.querySelector(
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

  console.log(score);

  const el = document.querySelector("#score span:not(.description)");

  el.innerHTML = score.current;

  /* If the new score is within 80 points of the winning score
   * There's probably an orphan coin
   * Place the mystery box to get to the winning score
   */

  score.remaining < 1 || score.current >= score.winning ? stopGame(1) : null;
}

let previousMunch = 0;
function munchModulo() {
  previousMunch % 2 === 0 ? playAudio("munch_1.wav") : playAudio("munch_2.wav");

  previousMunch++;
}

function playAudio(file) {
  var audio = new Audio("/assets/sounds/" + file);
  audio.pause();
  audio.volume = 0.25;
  audio.play();
}

function updatePacLand(who, move, direction, el) {
  pacmen[move.y][move.x] = who;

  //Update old pacman HTML element
  el.removeAttribute("id");
  delete el.dataset.pacman;

  //Select new pacman HTML element
  const newPosition = document.querySelector(
    '[data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );

  //Update new pacman HTML element
  who === 3
    ? newPosition.setAttribute("id", "pacman")
    : newPosition.setAttribute("id", "twopac");
  newPosition.dataset.pacman = direction;
}
function updateWorld(move, value) {
  world[move.y][move.x] = value;

  const spot = document.querySelector(
    '#gameboard [data-y="' + move.y + '"][data-x="' + move.x + '"]'
  );
  spot.className = "";
  delete spot.dataset.score;
}
