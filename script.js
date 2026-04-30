const characterButton = document.querySelector(".character-button");
const characterImage = document.querySelector(".character");
const message = document.querySelector(".message");
const lyricLine = document.querySelector("#lyricLine");
const song = document.querySelector("#song");

let isSmiling = false;
const frames = {
  calm: "1.png",
  smile: "2.png",
};

const lyrics = [
  { time: 0, text: "Mr. Blue Melville was a sailor at dawn" },
  { time: 7, text: "He sailed on his ship as I walked through the shore" },
  { time: 15, text: "He took all my glitter and left me away" },
  { time: 22, text: "Now Mr. Blue Melville has gone" },
  { time: 30, text: "The nights are brighter when you lingered" },
  { time: 37, text: "And love was a mystery 'til you walk by my side" },
  { time: 45, text: "And now, my heart's singing, but tonight, I'll be fine" },
  { time: 52, text: "Without you, I'm walking back home" },
  { time: 52, text: "\u266a\u266a\u266a" },
  { time: 86, text: "The nights are brighter when you lingered" },
  { time: 97, text: "And love was a mystery 'til you walk by my side" },
  { time: 101, text: "And now, my heart's singing, but tonight, I'll be fine" },
  { time: 109, text: "Without you, I'm walking back home" },
];

let currentLyricIndex = -1;
const duplicateLyricHoldSeconds = 6;
const mobileLyricQuery = window.matchMedia("(max-width: 760px)");

function swapCharacter() {
  isSmiling = !isSmiling;
  characterImage.classList.add("is-changing");
  characterButton.classList.toggle("is-smiling", isSmiling);
  characterButton.setAttribute("aria-pressed", String(isSmiling));

  window.setTimeout(() => {
    characterImage.src = isSmiling ? frames.smile : frames.calm;
    characterImage.classList.remove("is-changing");
  }, 120);
}

characterButton.addEventListener("click", swapCharacter);

function findLyricIndex(time) {
  let activeIndex = 0;

  for (let index = lyrics.length - 1; index >= 0; index -= 1) {
    if (time >= lyrics[index].time) {
      activeIndex = index;
      break;
    }
  }

  const activeTime = lyrics[activeIndex].time;
  let groupStart = activeIndex;
  let groupEnd = activeIndex;

  while (groupStart > 0 && lyrics[groupStart - 1].time === activeTime) {
    groupStart -= 1;
  }

  while (
    groupEnd < lyrics.length - 1 &&
    lyrics[groupEnd + 1].time === activeTime
  ) {
    groupEnd += 1;
  }

  if (groupStart !== groupEnd) {
    const elapsed = Math.max(0, time - activeTime);
    const duplicateOffset = Math.min(
      groupEnd - groupStart,
      Math.floor(elapsed / duplicateLyricHoldSeconds)
    );
    return groupStart + duplicateOffset;
  }

  return activeIndex;
}

function setLyric(index) {
  if (index === currentLyricIndex) {
    return;
  }

  currentLyricIndex = index;
  const lyricText = lyrics[index].text;
  message.classList.add("is-changing");
  message.classList.toggle("is-music", lyricText === "\u266a\u266a\u266a");

  window.setTimeout(() => {
    lyricLine.textContent = formatLyric(lyricText);
    message.classList.remove("is-changing");
  }, 120);
}

function formatLyric(text) {
  if (!mobileLyricQuery.matches || text.length <= 34) {
    return text;
  }

  const middle = Math.floor(text.length / 2);
  const before = text.lastIndexOf(" ", middle);
  const after = text.indexOf(" ", middle + 1);
  const breakAt = before > 12 ? before : after;

  if (breakAt < 0) {
    return text;
  }

  return `${text.slice(0, breakAt)}\n${text.slice(breakAt + 1)}`;
}

function syncLyrics() {
  const index = findLyricIndex(song.currentTime);
  setLyric(index);
}

function startSong() {
  song.volume = 1;
  song.play().catch(() => {});
}

song.addEventListener("timeupdate", syncLyrics);
setLyric(0);
document.addEventListener("DOMContentLoaded", startSong);
window.addEventListener("load", startSong);
document.addEventListener("pointerdown", startSong, { once: true });
