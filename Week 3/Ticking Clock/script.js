const display = document.getElementById("display");
window.evaluated = false;

function press(num) {
  resetDisplay();
  const current = display.textContent;

  current.length === 1 && parseInt(current) === 0
    ? refreshDisplay(num)
    : refreshDisplay(current + num);
}

function clr() {
  refreshDisplay(0);
}

function refreshDisplay(num) {
  display.innerText = num;
}

function setOP(operator) {
  resetDisplay();

  let current = display.textContent;

  //if user intends to start expression with a negative number
  //skip remaining steps and return symbol;
  if (current === "0" && operator === "-") {
    refreshDisplay(operator);
    return;
  }

  //check to make sure identical operators are not repeated contiguously
  const lastCharacter = current.slice(-1);
  const isOperator = lastCharacter.match(/[-*+\/]/);

  isOperator ? (current = current.slice(0, -1)) : null;

  refreshDisplay(current + operator);
}

function setDec(dec) {
  resetDisplay();

  const current = display.textContent;
  //check if it already has an operator
  const hasOperator = hasOperator(current);
  //check if it already has a decimal
  const hasDec = current.match(/[.]/);

  //if current formula does not have a decimal, refresh display
  !hasDec
    ? refreshDisplay(current + ".")
    : //else if current formula has a decimal and NO operator, don't allow the addition of a decimal
    hasDec && !hasOperator
    ? refreshDisplay(current)
    : //else if current formula has an operator consult Thoth to see if last postfix has a decimal point
    //if Thoth says "true" return current formula, else return forumla with decimal
    consultThoth(current)
    ? refreshDisplay(current)
    : refreshDisplay(current + ".");
}

/* Thoth, the Egyptian God of Wisdom
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%//#&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@@@@////////...........*@@@@@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@@@@@@/, ////////.............. @@@@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@@@@&     //////////..................@@@@@@@@@@@@@@@
 * @@@@@@@@@@@@@@@   .  ,@@@@@@@@@////.................../@@@@@@@@@@@@
 * @@@@@@@@@@@@  , (@@@@@@@@@@@@@@////......................@@@@@@@@@@
 * @@@@@@@@@# , @@@@@@@@@@@@@@@@@////........................#@@@@@@@@
 * @@@@@@@@ .*@@@@@@@@@@@@@@@@@(////...........................@@@@@@@
 * @@@@@@/  @@@@@@@@@@@@@@&...//// ............................ @@@@@@
 * @@@@@@ ,@@@@@@@@@@@@@...../////...............................@@@@@
 * @@@@@..@@@@@@@@@@,& ..... *****........./,%/,%##&** ..........@@@@@
 * @@@@@@@@@(******,%(.......,,,***.......*,%*,%##%********.......@@@@
 * @@@@@@@***********#...... ,(\/**\/.......//,,(#((************..@@@@
 * @@@@@@************,.......,#****........%%(##,************** .. @@@
 * @@@@@@************,.......##%%#%......./%(,******************.. @@@
 * @@@@@@************,...... ,,#%#&.......,*********************.. @@@
 * @@@@@@,***********,//////#******((#####,*********************((%@@@
 * @@@@@%.,,,,,,,,#****************((####(,***********@,,,,,,,,,&&#@@@
 * @@@@@&%#(*,..,,@(*********************************@@/,,,,,,,,%@@@@@
 * @@@@@**********@@*******************************\/@@@%********@@@@@
 * @@@@**********@@@@*****************************@@@@@@********,@@@@@
 * @@@@**********@@@@@,**************************@@@@@@@*********@@@@@
 * @@@@*********@@@@@@,*************************@@@@@@@@*********@@@@@
 * @@@.********,@@@@@@@************************@@@@@@@@@********,@@@@@
 * @@@*********@@@@@@@@,**********************,@@@@@@@@@********,@@@@@
 */
function consultThoth(formula) {
  let postfixHasDecimal = false;

  //make sure regex is "greedy" so we can find all operands
  const operands = formula.match(/[-*+\/]/g);

  //check string AFTER the LAST operand
  const lastOperand = operands ? operands[operands.length - 1] : null;
  //isolate the LAST postfix
  const postfix = lastOperand
    ? formula.substring(formula.indexOf(lastOperand) + 1)
    : null;

  // if postfix has a decimal return true
  postfixHasDecimal = postfix && postfix.match(/[.]/) ? true : false;

  return postfixHasDecimal;
}

function calculate() {
  const expression = display.textContent;
  let result = eval(expression);

  //convert to exponential equation if larger than display
  result = result.toString().length > 11 ? expo(result, 2) : result;

  window.evaluated = true;

  refreshDisplay(result);
}

function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
}

//reset display if previous action was calculate()
function resetDisplay() {
  window.evaluated ? (refreshDisplay(0), (window.evaluated = false)) : null;
}

function hasOperator(expression) {
  return expression.match(/[-*+\/]/);
}
