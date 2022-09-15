function toggleState(el) {
  el.target.innerHTML === "Login"
    ? (el.target.innerHTML = "Logout")
    : (el.target.innerHTML = "Login");
}

function likeAlert(el) {
  const def = el.target.getAttribute("data");
  const numLikes = parseInt(el.target.innerHTML.match(/\d+/));
  const newNum = numLikes + 1;
  const count = el.target.querySelector("span");

  count.innerHTML = newNum;

  let message = def === "def-1" ? "Ninja definition #1" : "Ninja definition #2";

  message += " now has " + newNum + " likes!";

  alert(message);
}

function removeBtn(el) {
  el.remove();
}
