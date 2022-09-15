//Declare global scope elements
const video = document.querySelector("video");
const timer = document.getElementById("timer");
const progress = document.querySelector("progress");
const mute = document.getElementById("mute");
const fullscreen = document.getElementById("fullscreen");

/*
 * This variable will change when play button is clicked
 * to prevent hover state from interfering with intended playback
 */
let playClicked = false;

//Create event listener for play and ended video state
const videoPlayBackEventList = ["play", "ended"];
for (e of videoPlayBackEventList) {
  video.addEventListener(e, function (event) {
    let change = event.type;

    progressLoop(change, event);
  });
}
//handles progress bar behavior
//TODO: create replay function when video ends
function progressLoop(state, event) {
  state === "play" ? startProgressTimer(event) : null;
}

//Sets progress bar and timer state when video is playing
function startProgressTimer(event) {
  console.log(event);
  setInterval(function () {
    progress.value = Math.round((video.currentTime / video.duration) * 100);
    timer.innerHTML = Math.round(video.currentTime) + " seconds";
  });
}

//handles video play pause behaviors
function videoPlayPause(e) {
  playClicked = true;
  const playState = video.playing;
  const button = e.target;
  togglePlayPauseButton(playState, button);
  playPauseState(playState);
}

//Toggle play pause button appearance based on previous state
function togglePlayPauseButton(playState, button) {
  playState === false
    ? (button.classList.add("fa-pause-circle"),
      button.classList.remove("fa-play-circle"))
    : (button.classList.add("fa-play-circle"),
      button.classList.remove("fa-pause-circle"));
}

//Toggle video play pause based on previous state
function playPauseState(playState) {
  playState === false ? video.play() : video.pause();
}

//create a property for testing if the video is actively playing
Object.defineProperty(HTMLMediaElement.prototype, "playing", {
  get: function () {
    return !!(
      this.currentTime > 0 &&
      !this.paused &&
      !this.ended &&
      this.readyState > 2
    );
  },
});

//Mute Button Behavior
let muted = false;
mute.addEventListener("click", function (e) {
  muted === false
    ? ((muted = true),
      e.target.classList.add("hidden"),
      mute.appendChild(muteButton()))
    : ((muted = false),
      document.getElementById("unmute").classList.remove("hidden"),
      document.getElementById("muted").remove());
});

function muteButton() {
  const muteButton = document.createElement("button");
  const icon = document.createElement("i");

  muteButton.setAttribute("id", "muted");
  icon.classList.add("fa", "fa-volume-mute");

  muteButton.appendChild(icon);

  return muteButton;
}

//Video Fullscreen
fullscreen.addEventListener("click", (event) => {
  video.requestFullscreen();
});

//Video Preview
//Create event listener for mouseover and mouseleave video state
const mouseBehavior = ["mouseover", "mouseleave"];
for (e of mouseBehavior) {
  document.getElementById("video").addEventListener(e, function (event) {
    //prevent hover state behavior if playpause button was clicked
    playClicked === false
      ? //make sure that the event target was in fact the video container
        event.target.id === "video" && event.type === "mouseover"
        ? previewVideo("start")
        : previewVideo("stop")
      : null;
  });
}
//handles all video preview behaviors
function previewVideo(state) {
  const muteIcon = mute.querySelector("img");
  console.log(muteButton.classList);
  state === "start"
    ? (video.play(),
      muteIcon.classList.add("hidden"),
      mute.appendChild(muteButton()),
      video.setAttribute("muted", "muted"))
    : (video.pause(),
      (video.currentTime = 0),
      muteIcon.classList.remove("hidden"),
      document.getElementById("muted").remove(),
      video.setAttribute("muted", "unmuted"));
}
