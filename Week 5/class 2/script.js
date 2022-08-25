// $(document).ready(function () {
//   // JQuery methods go here
//   $("button").click(function () {
//     $("h1").hide();
//   });
// });

var button = document.querySelector("button");

button.addEventListener("click", function (e) {
  var h1 = document.querySelector("h1");

  h1.style.display = "none";
});
