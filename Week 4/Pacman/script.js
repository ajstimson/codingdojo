const gameBoard = document.getElementById("gameboard");
let world = [];
let pacman = {};
let gamePlay = true;
let difficulty = "easy";
let winningScore = 0;
gameBoardSize();

function gameBoardSize() {
  const width = window.innerWidth * 0.29;
  const gameWidth = Math.round(width / 20) * 20;
  document.querySelector(".screen").style.width = gameWidth + 7 + "px";
  document.querySelector(".screen").style.height = gameWidth + 7 + "px";
  gameBoard.style.width = gameWidth + "px";
  gameBoard.style.height = gameWidth + "px";
}

//* Generate Map
function generateMap(level) {
  //re-enable gameplay
  gamePlay = true;

  //set difficulty to global scope
  difficulty = level;

  //clear gameboard classList
  gameBoard.className = "";

  //create empty world
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

  // * Generate walls based on difficulty
  level === "hard"
    ? setRandomWalls()
    : level === "medium"
    ? setMediumWalls()
    : setLongWalls();

  // * Place Pacman
  placePacman();

  // * Set Winning Score
  setWinningScore();

  // * Place Ghosts
  placeGhosts(level);

  // * Place Cherries
  placeCherries(level);

  // * Generate HTML
  mapHTML(world);

  // * Release the Ghosts!
  runGhosts();
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

function setRandomWalls() {
  // Wall seeds should never touch the edges so start incrementing on the third layer
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

function placePacman() {
  const available = possPositions(pacPlace);
  //Select position randomly
  const location = available[Math.floor(Math.random() * available.length)];
  world[location.y][location.x] = 3;

  pacman.y = location.y;
  pacman.x = location.x;
}

function setWinningScore() {
  // * flatten world array
  let arr = world.flat();

  // * convert array values to score values
  arr = arr.map((y) => (y === 1 ? 20 : y === 5 ? 50 : 0));

  // * return sum of all score values
  winningScore = arr.reduce(
    (sum, num) => sum + (Array.isArray(num) ? sumArray(num) : num * 1),
    0
  );
}

function placeGhosts(difficulty) {
  const available = possPositions(ghostPlace);
  const numGhosts = difficulty === "hard" ? 4 : difficulty === "medium" ? 3 : 2;
  for (let i = 0; i < numGhosts; i++) {
    //Select position randomly
    const location = notTooClose(available);
    //Place ghost
    world[location.y][location.x] = 4;
  }
}

function notTooClose(available) {
  //Select position randomly
  let randomIndex = array_rand(available);
  let location = available[randomIndex];
  //Set max min y values for consideration
  const low = pacman.y - 6;
  const high = pacman.y + 6;

  return location.y > low && location.y < high
    ? notTooClose(available)
    : location;
}

function placeCherries(difficulty) {
  const numGhosts = difficulty === "hard" ? 2 : difficulty === "medium" ? 4 : 6;
  const available = possPositions(cherryPlace);

  for (let i = 0; i < numGhosts; i++) {
    const randomIndex = array_rand(available);
    const location = available[randomIndex];
    world[location.y][location.x] = 5;
  }
}

function array_rand(array, num) {
  const keys = Object.keys(array);
  if (typeof num === "undefined" || num === null) {
    num = 1;
  } else {
    num = +num;
  }
  if (isNaN(num) || num < 1 || num > keys.length) {
    return null;
  }
  // shuffle the array of keys
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 0 ≤ j ≤ i
    const tmp = keys[j];
    keys[j] = keys[i];
    keys[i] = tmp;
  }
  return num === 1 ? keys[0] : keys.slice(0, num);
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
i = 0;
function pacPlace(row, y, x) {
  const position = positionDetails(row, y, x);
  const sum =
    position.up.val +
    position.down.val +
    position.left.val +
    position.right.val;
  //console.log(sum);
  if (sum === 6 && position.focus.val === 1) {
    return { y: y, x: x };
  }
  return null;
}

function ghostPlace(row, y, x) {
  const position = positionDetails(row, y, x);
  if (position.focus.val === 1) {
    return { y: y, x: x };
  }

  return null;
}

function cherryPlace(row, y, x) {
  const position = positionDetails(row, y, x);
  const sum =
    position.up.val +
    position.down.val +
    position.left.val +
    position.right.val;
  if (sum > 6 && position.focus.val === 1) {
    return { y: y, x: x };
  }
}

function mapHTML(world) {
  let HTML = "";
  let ghostCount = 1;
  for (let i = 0; i < world.length; i++) {
    HTML += '<div class="row">';
    world[i].map((row, x) => {
      row === 2
        ? (HTML +=
            '<div data-score="-1" data-y="' +
            i +
            '" data-x="' +
            x +
            '" class="brick"></div>')
        : row === 1
        ? (HTML +=
            '<div data-score="20" data-y="' +
            i +
            '" data-x="' +
            x +
            '" class="coin"></div>')
        : row === 3
        ? (HTML +=
            '<div id="pacman" data-pacman="right" data-y="' +
            i +
            '" data-x="' +
            x +
            '"></div>')
        : row === 4
        ? (HTML +=
            '<div data-score=false data-y="' +
            i +
            '" data-x="' +
            x +
            '" class="ghost" data-ghost="' +
            (ghostCount, ghostCount++) +
            '"></div>')
        : row === 5
        ? (HTML +=
            '<div data-score="50" data-y="' +
            i +
            '" data-x="' +
            x +
            '" class="cherries"></div>')
        : (HTML +=
            '<div data-score="0" data-y="' +
            i +
            '" data-x="' +
            x +
            '" class="empty"></div>');
    });
    HTML += "</div>";
  }

  gameBoard.innerHTML = HTML;
}

function runGhosts() {
  const interval =
    difficulty === "easy" ? 500 : difficulty === "medium" ? 250 : 150;
  let run = setInterval(function () {
    if (gamePlay === false) {
      clearInterval(run);
    } else {
      moveGhosts();
    }
  }, interval);
}
document.onkeydown = checkKey;

const keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        supportsPassive = true;
      },
    })
  );
} catch (e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent =
  "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";

// call this to Disable
function disableScroll() {
  window.addEventListener("DOMMouseScroll", preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener("touchmove", preventDefault, wheelOpt); // mobile
  window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener("DOMMouseScroll", preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener("touchmove", preventDefault, wheelOpt);
  window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}

function checkKey(e) {
  e = e || window.event;

  const direction =
    e.keyCode == "38"
      ? "up"
      : e.keyCode == "40"
      ? "down"
      : e.keyCode == "37"
      ? "left"
      : e.keyCode == "39"
      ? "right"
      : null;
  gamePlay ? movePacman(direction) : null;
}

function movePacman(direction) {
  const pacEl = document.getElementById("pacman");
  const position = positionDetails(world[pacman.y], pacman.y, pacman.x);

  direction === "up" && position.up.val !== 2
    ? redrawPacman(pacEl, position.up, direction)
    : direction === "down" && position.down.val !== 2
    ? redrawPacman(pacEl, position.down, direction)
    : direction === "left" && position.left.val !== 2
    ? redrawPacman(pacEl, position.left, direction)
    : direction === "right" && position.right.val !== 2
    ? redrawPacman(pacEl, position.right, direction)
    : null;
}

function redrawPacman(el, position, direction) {
  //Update world map array
  const squareValue = pacmanWorldArray(position);

  //Update pacman object
  pacman.x = position.x;
  pacman.y = position.y;

  //Update old pacman HTML element
  el.removeAttribute("id");
  el.classList.add("empty");
  delete el.dataset.pacman;

  //Select new pacman HTML element
  const newPosition = document.querySelector(
    '[data-y="' + position.y + '"][data-x="' + position.x + '"]'
  );

  //Update new pacman HTML element
  newPosition.setAttribute("id", "pacman");
  newPosition.dataset.pacman = direction;

  //If new position is a coin...
  /*
   * Update score by 20 points
   * Remove coin class & add empty
   */
  newPosition.classList.contains("coin")
    ? (updateScore(20),
      newPosition.classList.remove("coin"),
      newPosition.classList.add("empty"))
    : //If new position is a Cherry...
    /*
     * Update score by 50 points
     * Remove cherries class & add empty
     */
    newPosition.classList.contains("cherries")
    ? (updateScore(50),
      newPosition.classList.remove("cherries"),
      newPosition.classList.add("empty"))
    : //If new position is a Ghost...
    /*
     * STOP THE GAME
     */
    newPosition.classList.contains("ghost")
    ? stopGame(squareValue)
    : null;
}

function updateScore(score) {
  const el = document.querySelector("#score span:not(.description)");
  const currentScore = parseInt(el.innerHTML);
  const newScore = currentScore + score;

  el.innerHTML = newScore;

  newScore === winningScore ? stopGame(1) : null;
}

function pacmanWorldArray(direction) {
  // if new position is not a ghost, move pacman's value 3 to new position
  // otherwise 6 = dead pacman
  world[direction.y][direction.x] !== 4
    ? (world[direction.y][direction.x] = 3)
    : (world[direction.y][direction.x] = 6);

  //old position should now be empty
  world[pacman.y][pacman.x] = 0;

  return world[direction.y][direction.x];
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
    //remove possible moves where a brick or ghost are present
    squareValue !== 2 && squareValue !== 4
      ? possibleMoves.push(direction)
      : null;
  }

  //Select move direction at random
  //TODO: create a more challenging find algorithm
  const randomMove = Math.floor(Math.random() * possibleMoves.length);
  const move = possibleMoves[randomMove];

  const newCoordinates = position[move];
  redrawGhost(ghost, newCoordinates);
}

function removeOption(item, array) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
  }
  return array;
}

function redrawGhost(oldGhost, newGhost) {
  const ghostType = oldGhost.dataset.ghost;
  const reserve = oldGhost.dataset.reserve ? oldGhost.dataset.reserve : 1;

  //remove ghost class
  oldGhost.classList.remove("ghost");

  //Apply class to old position since the ghost does not "consume" anything
  if (oldGhost.dataset.reserve === undefined) {
    oldGhost.classList.add("coin");
  } else {
    oldGhost.dataset.reserve === "0"
      ? oldGhost.classList.add("empty")
      : oldGhost.dataset.reserve === "1"
      ? oldGhost.classList.add("coin")
      : oldGhost.dataset.reserve === "5"
      ? oldGhost.classList.add("cherries")
      : null;
  }

  //remove ghost and reserve data attributes
  delete oldGhost.dataset.ghost;
  delete oldGhost.dataset.reserve;

  const newPosition = document.querySelector(
    '[data-y="' + newGhost.y + '"][data-x="' + newGhost.x + '"]'
  );

  //add reserve value to restore when Ghost moves on
  newPosition.dataset.reserve = world[newGhost.y][newGhost.x];
  //carry over ghost type data attribute from old position
  newPosition.dataset.ghost = ghostType;
  //clear new position classList
  newPosition.className = "";
  //add ghost class name
  newPosition.classList.add("ghost");

  const previousSquare = {
    x: parseInt(oldGhost.dataset.x),
    y: parseInt(oldGhost.dataset.y),
    val: parseInt(reserve),
  };
  const squareValue = ghostWorldArray(previousSquare, newGhost);

  squareValue === 6 ? stopGame(squareValue) : null;
}

function ghostWorldArray(oldSQ, newSQ) {
  world[oldSQ.y][oldSQ.x] = oldSQ.val;
  world[newSQ.y][newSQ.x] !== 3
    ? (world[newSQ.y][newSQ.x] = 4)
    : (world[newSQ.y][newSQ.x] = 6);

  return world[newSQ.y][newSQ.x];
}

function stopGame(state) {
  gamePlay = false;

  //If pacman collided with a ghost...
  /*
   * Animate pacman death
   * Remove life & generate new map if lives left
   */
  state === 6
    ? pacmanDead()
    : //Otherwise pacman won!
      pacWon();
}

function pacmanDead() {
  const pacEl = document.querySelector(
    '[data-y="' + pacman.y + '"][data-x="' + pacman.x + '"]'
  );

  pacEl.classList.add("dead");
  gameBoard.classList.add("pacman-dead");

  removeLife(pacEl);
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
    ? ((lifeMeter.innerHTML = lifeMeter.innerHTML.slice(0, -1)),
      restartGame(el))
    : // If lives are 0
      /*
       * Run game over animation
       */
      gameOver(lifeMeter);
}

function restartGame(el) {
  setTimeout(() => {
    removePacman();
  }, 800);
  setTimeout(() => {
    gameBoard.classList.remove("pacman-dead");
    el.removeAttribute("id");
    //TODO: create new function to redraw pacman
    runGhosts();
    gamePlay = true;
  }, 1500);
}

function gameOver(lives) {
  gameBoard.classList.add("game-over");
  const pacEl = document.querySelector(
    '[data-y="' + pacman.y + '"][data-x="' + pacman.x + '"]'
  );
  pacEl.classList.add("dead");
  clearBoard();
  announceGameOver();

  setTimeout(() => {
    pacEl.removeAttribute("id");

    //Reset life meter
    lives.innerHTML = "111";
  }, 1500);
}

function pacWon() {
  gameBoard.classList.add("game-over");

  clearBoard();
  announceWin();

  setTimeout(() => {
    //Add to life meter
    lives.innerHTML += "1";
    generateMap(difficulty);
  }, 1500);
}

function clearBoard() {
  const board = document.querySelectorAll("#gameboard>.row>div");
  for (let square = 0; square < board.length; square++) {
    const maxRow = board[board.length - 1].dataset.y;

    board[square].dataset.x !== "0" &&
    board[square].dataset.x !== maxRow &&
    board[square].dataset.y !== "0" &&
    board[square].dataset.y !== maxRow &&
    board[square].getAttribute("id") !== "pacman"
      ? ((board[square].className = ""), board[square].classList.add("empty"))
      : console.log("skip!");
  }
}

function announceWin() {
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
}

//TODO: Create High Score records
//TODO: Create button to add a different pacman
//TODO: figure out how to make them move
