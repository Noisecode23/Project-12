console.log("Lets Write javascript");
let currentSong = new Audio()

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic =(track)=>{
  // let audio = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track
  currentSong.play()
}
async function main() {
  //list of all songs
  let songs = await getSongs();
  let songUL = document.querySelector('.songsList').getElementsByTagName('ul')[0]
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> 
    <img class="invert" src="music.svg" alt="">
    <div class="info">
        <div>${song.replaceAll("%20"," ")}</div>
        <div>Ankit</div>
    </div>
    <div class="playNow">
        <span>play now</span>
        <img class="invert" src="play2.svg" alt="">
    </div></li>`
  }
  
  Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element =>{

      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  });

}
main();
