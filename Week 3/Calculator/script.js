const display = document.getElementById("display");

function press(num) {
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
  let current = display.textContent;
  const lastCharacter = current.slice(-1);
  const isOperator = lastCharacter.match(/[-*+\/]/);

  isOperator ? (current = current.slice(0, -1)) : null;

  refreshDisplay(current + operator);
}

function setDec(dec) {
  const current = display.textContent;
  //check if it already has an operator
  const hasOperator = current.match(/[-*+\/]/);
  //check if it already has a decimal
  const hasDec = current.match(/[.]/);

  //if current formula does not have a decimal, refresh display
  !hasDec
    ? refreshDisplay(current + ".")
    : //else if current formula has a decimal and NO operator, don't allow the addition of a decimal
    hasDec && !hasOperator
    ? refreshDisplay(current)
    : //else if current formula has an operator consult Toth to see if last postfix has a decimal point
    //if Toth says "true" return current formula, else return forumla with decimal
    consultThoth(current)
    ? refreshDisplay(current)
    : refreshDisplay(current + ".");
}

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
  const result = eval(expression);

  refreshDisplay(result);
}

//TODO: set state once an expression has been executed (run clear)
//TODO: expand the display if the numbers exceed width
