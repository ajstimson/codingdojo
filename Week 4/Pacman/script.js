const gameBoard = document.getElementById("gameboard");
let world = [];
let players = 1;
let pacman = {};
let twopac = {};
let gamePlay = false;
let difficulty = "easy";
let numGhosts = difficulty === "hard" ? 4 : difficulty === "medium" ? 3 : 2;
let winningScore = 0;
let mysteryBox = false;
let playedAudio = 0;
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
  playedAudio % 2 === 0 ? playAudio("game_start.wav") : null;
  playedAudio++;

  // * enable gameplay
  gamePlay = true;

  // * set difficulty to global scope
  difficulty = level;

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

  // * Place Pacman
  placePacman();

  // * Place twoPac
  players === 2 ? placeTwoPac() : null;

  // * Set Winning Score
  setWinningScore();

  // * Place Ghosts
  placeGhosts();

  // * Place Cherries
  placeCherries(level);

  // * Generate HTML
  mapHTML(world);

  // * Release the Ghosts!
  runGhosts();
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

function placePacman() {
  const available = possPositions(pacPlace);
  //Select position randomly
  const location = selectLocationRandomly(available);
  if (location !== undefined) {
    world[location.y][location.x] = 3;
    pacman.y = location.y;
    pacman.x = location.x;
  } else {
    //fallback position just in case pacPlace formula yields no results
    world[1][1] = 3;
    pacman.y = 1;
    pacman.x = 1;
  }
}

function selectLocationRandomly(available) {
  return available[Math.floor(Math.random() * available.length)];
}

function placeTwoPac() {
  const available = possPositions(pacPlace);
  //Select position randomly
  const location = selectLocationRandomly(available);
  if (location !== undefined) {
    //TwoPac is value 8
    world[location.y][location.x] = 8;
    twopac.y = location.y;
    twopac.x = location.x;
  } else {
    //fallback position just in case pacPlace formula yields no results
    world[1][1] = 3;
    twopac.y = 1;
    twopac.x = 1;
  }
}

function placeMysteryBox() {
  const location = possPositions(mysteryPlace)[0];

  if (location !== undefined) {
    world[location.y][location.x] = 7;
    mysteryBox = true;
    drawMysteryBox(location);
  } else {
    placeMysteryBox();
  }
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

  const existingScore = parseInt(
    document.querySelector("#score>span+span").innerText
  );
  winningScore = winningScore + existingScore;
}

function placeGhosts() {
  const available = possPositions(ghostPlace);
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
  const numCherries =
    difficulty === "hard" ? 2 : difficulty === "medium" ? 4 : 6;
  const available = possPositions(cherryPlace);

  for (let i = 0; i < numCherries; i++) {
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
  if (sum === 6 && position.focus.val === 1) {
    return { y: y, x: x };
  }
  return null;
}

function mysteryPlace(row, y, x) {
  const position = positionDetails(row, y, x);

  const possibleSpot = [];
  //place the mystery box near pacman
  if (position.focus.val === 3) {
    for (let step = 6; step > 0; step--) {
      //walk six steps to the left of pacman to find an empty space to place mystery box
      possibleSpot.left = position.focus.x - step;
      possibleSpot.leftVal = world[position.focus.y][possibleSpot.left];

      //walk six steps to the right of pacman to find an empty space to place mystery box
      possibleSpot.right = position.focus.x + step;
      possibleSpot.rightVal = world[position.focus.y][possibleSpot.right];

      if (possibleSpot.leftVal === 0) {
        return {
          y: position.focus.y,
          x: possibleSpot.left,
        };
      }
      if (possibleSpot.rightVal === 0) {
        return {
          y: position.focus.y,
          x: possibleSpot.right,
        };
      }
    }
  }
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
        : row === 8
        ? (HTML +=
            '<div id="twopac" data-y="' +
            i +
            '" data-x="' +
            x +
            '" data-pacman="left"></div>')
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

  //select characters global object
  const character = isPacman ? pacman : isTwopac ? twopac : null;

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

  gamePlay && direction ? movePacmen(direction, el, character) : null;
}

function movePacmen(direction, el, character) {
  // * get character's initial position
  const y = parseInt(character.y);
  const x = parseInt(character.x);

  // * get surrounding values
  const position = positionDetails(world[y], y, x);

  // * create no go list starting with brick value 2
  let noGo = [2];
  // * make sure other pac character is added to no go list
  character === pacman ? noGo.push(8) : noGo.push(3);

  const desiredMove = position[direction];

  //add direction to character HTML element
  const characterHTML = document.querySelector(
    '[data-y="' + y + '"][data-x="' + x + '"]'
  );
  characterHTML.dataset.pacman = direction;

  //if the value of the object in desired square doesn't exist in the noGo list allow move!
  const moveOK = !noGo.includes(desiredMove.val);
  moveOK
    ? redrawPacmen(el, position[direction], direction, character)
    : (playAudio("wallbump.mp3"), animateBump(character, position[direction]));
}

function redrawPacmen(el, position, direction, character) {
  //False means character is twopac
  const isPacman = character === pacman;
  //3 = Pacman, 8 = Twopac
  const characterVal = isPacman ? 3 : 8;
  //Update world map array
  const squareValue = updateWorldArray(characterVal, position);

  //Update character object
  character.x = position.x;
  character.y = position.y;

  //Update old pacman HTML element
  el.removeAttribute("id");
  el.classList.add("empty");
  delete el.dataset.pacman;

  //Select new pacman HTML element
  const newPosition = document.querySelector(
    '[data-y="' + position.y + '"][data-x="' + position.x + '"]'
  );

  //Update new pacman HTML element
  isPacman
    ? newPosition.setAttribute("id", "pacman")
    : newPosition.setAttribute("id", "twopac");
  newPosition.dataset.pacman = direction;

  //If new position is a coin...
  /*
   * Update score by 20 points
   * Remove coin class & add empty
   */
  newPosition.classList.contains("coin")
    ? (updateScore(20),
      munchModulo(),
      newPosition.classList.remove("coin"),
      newPosition.classList.add("empty"))
    : //If new position is a Cherry...
    /*
     * Update score by 50 points
     * Remove cherries class & add empty
     */
    newPosition.classList.contains("cherries")
    ? (updateScore(50),
      playAudio("eat_fruit.wav"),
      newPosition.classList.remove("cherries"),
      newPosition.classList.add("empty"))
    : //If new position is mystery box, update score
    newPosition.classList.contains("mystery-box")
    ? (updateScore(80),
      newPosition.classList.remove("mystery-box"),
      newPosition.classList.add("empty"))
    : //If new position is a Ghost...
    /*
     * STOP THE GAME
     */
    newPosition.classList.contains("ghost")
    ? isPacman
      ? stopGame(squareValue)
      : killTwopac()
    : null;
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

function animateBump(who, obj) {
  const characterHTML = document.querySelector(
    '[data-y="' + who.y + '"][data-x="' + who.x + '"]'
  );
  characterHTML.classList.add("bump");
  const direction = characterHTML.dataset.pacman;

  characterHTML.dataset.pacman = direction;
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
      characterHTML.classList.remove("bump");
    }, 100);
  }
}

function updateScore(score) {
  const el = document.querySelector("#score span:not(.description)");
  const currentScore = parseInt(el.innerHTML);
  const newScore = currentScore + score;

  el.innerHTML = newScore;

  /* If the new score is within 80 points of the winning score
   * There's probably an orphan coin
   * Place the mystery box to get to the winning score
   */
  newScore >= winningScore - 80 && mysteryBox === false
    ? placeMysteryBox()
    : null;

  newScore >= winningScore ? stopGame(1) : null;
}

function updateWorldArray(num, direction) {
  //start by removing character from world array
  removeCharacterFromWorld(num, 1);

  // if new position is not a ghost, move pacman's value 3 to new position
  // otherwise 6 = dead pacman
  world[direction.y][direction.x] !== 4
    ? (world[direction.y][direction.x] = num)
    : //If this is a ghost, use 6 for dead pacman & 11 for dead twopac
      (world[direction.y][direction.x] = num + 3);

  return world[direction.y][direction.x];
}

function moveGhosts() {
  const ghosts = document.querySelectorAll(".ghost");

  for (const ghost of ghosts) {
    setCourse(ghost);
  }
}

function newGhosts() {
  for (let i = 0; i < numGhosts; i++) {
    const location = findRandomSpot();
    console.log(location);
    const spot = location[Math.floor(Math.random() * location.length)];
    world[location[0]["y"]][location[0]["x"]] = 4;
  }

  ressurectGhosts();
}

function ressurectGhosts() {
  let locations = [];
  for (let y = 0; y < world.length; y++) {
    if (locations.length >= numGhosts) {
      break;
    }
    world[y].map((row, x) => {
      row === 4 ? (locations.push(y), locations.push(x)) : null;
    });
  }

  drawGhosts(locations);
}

function drawGhosts(coordinates) {
  console.log(coordinates);
  for (let i = 0; i < coordinates.length; i + 2) {
    const target = document.querySelector(
      '[data-y="' + coordinates[i] + '"][data-x="' + coordinates[i + 1] + '"]'
    );

    target.classList.add("ghost");
    target.dataset.ghost = i;
  }
}

function findRandomSpot() {
  // const randY = Math.floor(Math.random() * (world.length - 1));
  // const randX = Math.floor(Math.random() * (world[0].length - 1));
  // const randomSpot = world[randY][randX];

  // let result = {};

  // if (randomSpot < 2) {
  //   result.y = randY;
  //   result.x = randX;
  //   return result;
  // } else {
  //   findRandomSpot();
  // }

  let locations = [];
  for (let y = 0; y < world.length; y++) {
    if (locations.length >= numGhosts) {
      break;
    }
    world[y].map((row, x) => {
      row === 0 ? (locations.push({ y: y }), locations.push({ x: x })) : null;
    });
  }

  return locations;
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
    //remove possible moves where a brick, ghost, or mysterybox are present
    squareValue !== 2 && squareValue !== 4 && squareValue !== 7
      ? possibleMoves.push(direction)
      : null;
  }

  //Select move direction at random
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

  squareValue === 6
    ? stopGame(squareValue)
    : squareValue === 11 || squareValue === 8
    ? killTwopac()
    : null;
}

function ghostWorldArray(oldSQ, newSQ) {
  removeCharacterFromWorld(4, numGhosts);
  world[newSQ.y][newSQ.x] !== 3
    ? (world[newSQ.y][newSQ.x] = 4)
    : (world[newSQ.y][newSQ.x] = 6);

  return world[newSQ.y][newSQ.x];
}

function drawMysteryBox(location) {
  const mysteryBoxHTML = document.querySelector(
    '[data-y="' + location.y + '"][data-x="' + location.x + '"]'
  );

  mysteryBoxHTML.className = "";
  mysteryBoxHTML.classList.add("mystery-box");
}

function stopGame(state) {
  gamePlay = false;
  //If pacman collided with a ghost...
  /*
   * Animate pacman death
   * Remove life & generate new map if lives left
   */
  state === 6 ? pacmanDead() : pacWon();
}

function pacmanDead() {
  const el = document.querySelector(
    '[data-y="' + pacman.y + '"][data-x="' + pacman.x + '"]'
  );

  el.classList.add("dead");
  delete el.dataset.pacman;
  playAudio("death_1.wav");
  gameBoard.classList.add("pacman-dead");

  removeLife(el);
}

function killTwopac() {
  const el = document.getElementById("twopac");
  //switch to single player mode to prevent further movement
  players = 1;
  el.classList.add("dead");
  gameBoard.classList.add("pacman-dead");
  playAudio("death_1.wav");
  //Re-enable gameplay

  setTimeout(() => {
    el.removeAttribute("id");
    delete el.dataset.pacman;

    gameBoard.classList.remove("pacman-dead");
    removeCharacterFromWorld(8, 1);

    const twopacLives = document.querySelector(".lives .twopac");
    const lifeValue = twopacLives.innerHTML.match(/1/g);

    // * re-enable two player mode
    players = 2;

    lifeValue !== null
      ? ((twopacLives.innerHTML = twopacLives.innerHTML.slice(0, -1)),
        twoPacs())
      : // If lives are 0, revert to single player mode
        (players = 1);
  }, 1500);
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
    removePacman(el);
  }, 800);
  setTimeout(() => {
    pacResurrection();
    runGhosts();
    gamePlay = true;
  }, 1500);
}

function removePacman(el) {
  gameBoard.classList.remove("pacman-dead");
  el.removeAttribute("id");
  el.className = "";
  //remove from world array
  removeCharacterFromWorld(3, 1);
}

function removeCharacterFromWorld(num, expected) {
  let found = 0;
  for (let y = 0; y < world.length; y++) {
    //remove all matching values from world array
    world[y] = world[y] = world[y].map((x, i) => {
      x === num ? found++ : found;
      // * if x is the character number
      // * and index is greater than number of characters allowed,
      // * remove character from array
      return x === num && found >= expected ? (x = 0) : (x = x);
    });
  }
}

function pacResurrection() {
  //Remove pacman's death from board
  removeCharacterFromWorld(6, 1);
  //Update world array with resurrected pacman position
  placePacman();
  playAudio("death_2.wav");

  const newPosition = document.querySelector(
    '[data-y="' + pacman.y + '"][data-x="' + pacman.x + '"]'
  );

  newPosition.className = "";
  newPosition.setAttribute("id", "pacman");

  const ghosts = document.querySelectorAll(".ghost");

  //If not enough ghosts, generate new ones
  ghosts.length < numGhosts ? newGhosts() : null;
}

function gameOver(lives) {
  gameBoard.classList.add("game-over");
  const pacEl = document.querySelector(
    '[data-y="' + pacman.y + '"][data-x="' + pacman.x + '"]'
  );
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
      : null;
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

  setHighScores();
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
  const score = document.querySelector("#score>span:last-of-type");

  score.innerHTML = 0;
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

  //If twopac died, remove death from board
  removeCharacterFromWorld(11, 1);
  players = 2;
  //If game is ongoing, draw twopac immediately
  if (gamePlay === true) {
    //place twopac in world array
    placeTwoPac();
    //draw twopac
    invokeTwoPac();
  }
}

function setTwopacLives() {
  const el = document.querySelector(".lives .player-2");
  el.innerHTML += '<div class="twopac">111</div>';
}

function invokeTwoPac() {
  const newPosition = document.querySelector(
    '[data-y="' + twopac.y + '"][data-x="' + twopac.x + '"]'
  );

  newPosition.className = "";
  newPosition.setAttribute("id", "twopac");
  playAudio("death_2.wav");
}

function revokeTwopac() {
  const twopacEl = document.getElementById("twopac");

  //reset HTML
  twopacEl
    ? (twopacEl.removeAttribute("id"), delete twopacEl.dataset.pacman)
    : null;

  //remove twopac from world array
  removeCharacterFromWorld(8, 1);

  //remove lives
  document.querySelector(".lives .twopac").remove();
}
