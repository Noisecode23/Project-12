console.log("Lets Write javascript");
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
  // Ensure seconds is a non-negative number
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format the time as "mm:ss"
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;

  return formattedTime;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songsList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> 
    <img class="invert" src="music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20", " ")}</div>
        <div>Ankit</div>
    </div>
    <div class="playNow">
        <span>play now</span>
        <img class="invert" src="play2.svg" alt="">
    </div></li>`;
  }
}
const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function DisplayAlbum(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName('a')
  let cardContainer = document.querySelector('.cardContainer')
  Array.from(anchors).forEach( async e=>{
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-1)[0]

      //Get metadata of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();

      console.log(response)

      
    }
  })

}
async function main() {
  //list of all songs
 await getSongs("songs/trending");
  playMusic(songs[0], true);

  //Display all the albums
  DisplayAlbum()
  //Attach an event listener to each songs
  Array.from(
    document.querySelector(".songsList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //Attach event listener on play, previous and next
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play2.svg";
    }
  });

  //Listen for timeupdte function
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${formatTime(
      currentSong.currentTime
    )}:${formatTime(currentSong.duration)}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Add an event listener to seekbar
  document.querySelector(".seekBar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent * 100 + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add an event listener on hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an event listener on cross
  document.querySelector("#close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //Add an event listener to previous
  document.querySelector("#previous").addEventListener("click", () => {
    console.log("previous clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index + 1]);
    }
  });
  document.querySelector("#next").addEventListener("click", () => {
    console.log("next clicked");

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add event listener on range
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("click", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // Load the playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
main();
