
// Audio player script with playlist and upload support

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progress = document.getElementById("progress");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");
const addSongBtn = document.getElementById("add-song");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const coverEl = document.getElementById("cover1"); // Make sure your HTML uses id="cover1" for the cover image

// Default playlist (can be replaced by user uploads)
const defaultPlaylist = [
  {
    title: "Song One",
    artist: "Artist One",
    url: "song1.mp3",
    cover: "cover1.jpg"
  },
  {
    title: "Song Two",
    artist: "Artist Two",
    url: "song2.mp3",
    cover: "cover2.jpg"
  }
];

let playlist = [...defaultPlaylist];
let currentIndex = 0;

// Set initial play button state and volume slider value
playBtn.innerHTML = "▶";
audio.volume = 1;
volumeSlider.value = audio.volume * 100;

// Format time as mm:ss
function formatTime(t) {
  const mins = Math.floor(t / 60);
  const secs = Math.floor(t % 60);
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

// Load a song by index
function loadSong(index) {
  const song = playlist[index];
  if (!song) return;
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist || "Unknown";
  audio.src = song.url;
  if (coverEl && song.cover) {
    coverEl.src = song.cover;
  }
  // Reset progress bar and time displays
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  audio.load();
  playBtn.innerHTML = "▶";
}

// Play the current song
function playSong() {
  audio.play();
  playBtn.innerHTML = "❚❚";
}

// Pause the current song
function pauseSong() {
  audio.pause();
  playBtn.innerHTML = "▶";
}

// Add a song to the playlist UI
function addToPlaylistUI(song, index) {
  const li = document.createElement("li");
  li.textContent = song.title + (song.artist ? " - " + song.artist : "");
  li.addEventListener("click", () => {
    currentIndex = index;
    loadSong(currentIndex);
    playSong();
    highlightCurrentSong();
  });
  playlistEl.appendChild(li);
}

// Highlight the currently playing song in the playlist UI
function highlightCurrentSong() {
  Array.from(playlistEl.children).forEach((li, idx) => {
    li.classList.toggle("active", idx === currentIndex);
  });
}

// Populate the playlist UI
function populatePlaylistUI() {
  playlistEl.innerHTML = "";
  playlist.forEach((song, idx) => addToPlaylistUI(song, idx));
  highlightCurrentSong();
}

// Audio time update event
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Seek in audio
progressBar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// Volume control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value / 100;
});

// Play/pause button
playBtn.addEventListener("click", () => {
  if (!playlist.length) return;
  if (audio.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

// Next button
nextBtn.addEventListener("click", () => {
  if (!playlist.length) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
  highlightCurrentSong();
});

// Previous button
prevBtn.addEventListener("click", () => {
  if (!playlist.length) return;
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
  highlightCurrentSong();
});

// When song ends, play next
audio.addEventListener("ended", () => {
  if (playlist.length > 0) {
    nextBtn.click();
  }
});

// Add song(s) button
addSongBtn.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "audio/*";
  input.multiple = true;
  input.onchange = (e) => {
    const files = Array.from(e.target.files);
    // Clear playlist and UI before adding new songs
    playlist = [];
    playlistEl.innerHTML = "";
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const song = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        url: url,
        artist: "User Upload",
        cover: "" // No cover for uploads
      };
      playlist.push(song);
    });
    populatePlaylistUI();
    if (playlist.length > 0) {
      currentIndex = 0;
      loadSong(currentIndex);
      playSong();
    }
  };
  input.click();
  // Initialize volume slider to match audio's default volume (0-1 mapped to 0-100)
  volumeSlider.value = audio.volume * 100;
});

// Initial load
if (playlist.length > 0) {
  populatePlaylistUI();
  loadSong(currentIndex);
} else {
  titleEl.textContent = "No song loaded";
  artistEl.textContent = "";
  audio.src = "";
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";
}