function like(el) {
  const numLikesEl = getPreviousSibling(el.target, ".num-likes").querySelector(
    "span"
  );
  const numLikes = parseInt(numLikesEl.innerHTML.match(/\d+/));
  const newLikes = numLikes + 1;

  numLikesEl.innerHTML = newLikes;
}

var getPreviousSibling = function (elem, selector) {
  // Get the next sibling element
  var sibling = elem.previousElementSibling;

  // If there's no selector, return the first sibling
  if (!selector) return sibling;

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling;
    sibling = sibling.previousElementSibling;
  }
};
