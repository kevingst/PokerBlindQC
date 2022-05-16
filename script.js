// Config
var smallBlind = [2000, 4000, 6000, 10000, 14000, 20000, 30000, 40000, 60000]
var nextBlindTime = 10

// Var
var timerFormat = ""
var gameTimeInSeconds = 0
var nextBlindInSeconds = nextBlindTime * 60
var gameTimerInterval = null
var blindsTimerInterval = null
var currentBlind = 0
let today = new Date().toLocaleDateString()
var settingModal = new bootstrap.Modal(document.getElementById('settingsModal'))
var changeBlindModal = new bootstrap.Modal(document.getElementById('changeBlindModal'))
var audio = new Audio('../assets/sound/mixkit-alarm-tone-996.wav');
console.log(audio)
var noSleep = new NoSleep();
document.addEventListener('click', function enableNoSleep() {
  document.removeEventListener('click', enableNoSleep, false);
  noSleep.enable();
}, false);

// Init date
document.getElementById('today').innerHTML = today

// Init bar
var bar = document.querySelector(".progress-bar")

// Init settings blinds
var blindIndex = 0
var settingBlindHTML = document.getElementById("blindZoneSetting")
var blindList = ''
smallBlind.forEach(element => {
  blindList += `<input type="text" class="form-control m-2" style="max-width: 100px;" value="` + element + `">`
});
settingBlindHTML.innerHTML = blindList

// Init settinf next blind time
var nextBlindTimeHTML = document.getElementById('nextBlindTime')
nextBlindTimeHTML.value = nextBlindTime

function addBlind() {
  let newBlind = document.createElement('input')
  newBlind.type = 'text'
  newBlind.classList = 'form-control m-2'
  newBlind.style = 'max-width: 100px'
  settingBlindHTML.appendChild(newBlind)
}

function deleteBlind() {
  settingBlindHTML.removeChild(settingBlindHTML.lastChild)
}

function loadConfig() {
  smallBlind = []
  settingBlindHTML.childNodes.forEach(element => {
    smallBlind.push(element.value)
  })
  nextBlindTime = nextBlindTimeHTML.value
  nextBlindInSeconds = nextBlindTime * 60
  console.log('loadconfig', nextBlindTime)
  switchHidden("settingsMenu", "currentGame")
  document.getElementById("settingsBtn").hidden = false
  updateBlindsHTML(true)
  start()
}

function start() {
  switchHidden("startBtn", "stopBtn")
  gameTimer()
  nextBlindTimer()
}

function gameTimer() {
  if (!gameTimerInterval) {
    gameTimerInterval = setInterval(() => {
      gameTimeInSeconds++
      updateTimerHTML(gameTimeInSeconds)
    }, 1000)
  }
}

function nextBlindTimer() {
  if (!blindsTimerInterval) {
    blindsTimerInterval = setInterval(() => {
      if (nextBlindInSeconds > 0) {
        nextBlindInSeconds--
      } else {
        updateBlindsTimerHTML(nextBlindInSeconds, true)
        changeBlindModal.show()
        audio.play()
        setTimeout(() => {
          changeBlindModal.hide()
          audio.pause();
          audio.currentTime = 0;
        }, 5000);
        nextBlindInSeconds = nextBlindTime * 60
      }
      updateBlindsTimerHTML(nextBlindInSeconds)
    }, 1000)
  }
}

function stop() {
  switchHidden("stopBtn", "startBtn")
  clearInterval(gameTimerInterval)
  clearInterval(blindsTimerInterval)
  gameTimerInterval = null
  blindsTimerInterval = null
}

function reset() {
  switchHidden("currentGame", "settingsMenu")
  settingModal.hide()
  stop()
  gameTimeInSeconds = 0
  console.log('reset', nextBlindTime)
  nextBlindInSeconds = nextBlindTime * 60
  updateTimerHTML(gameTimeInSeconds)
  updateBlindsTimerHTML(nextBlindInSeconds)
  updateBlindsHTML(true)
}

function toMMSS(seconds) {
  var seconds = parseInt(seconds, 10);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - (hours * 3600)) / 60);
  seconds = seconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  var time = minutes + ':' + seconds;
  return time;
}

function toHHMM(seconds) {
  var seconds = parseInt(seconds, 10);
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds - (hours * 3600)) / 60);
  seconds = seconds - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  var time = hours + ':' + minutes + ':' + seconds;
  return time;
}

function updateTimerHTML(seconds) {
  timerFormat = toHHMM(seconds)
  document.getElementById("timerFormat").innerHTML = timerFormat
}

function updateBlindsTimerHTML(seconds, isNext) {
  if (smallBlind.length - 1 == currentBlind) {
    clearInterval(blindsTimerInterval)
    seconds = 0
  }
  timerFormat = toMMSS(seconds)
  document.getElementById("timerBlinds").innerHTML = timerFormat
  console.log('updateBlindsTimerHTML', nextBlindTime)
  bar.style.width = (((nextBlindTime * 60) - seconds) / (nextBlindTime * 60)) * 100 + '%'
  if (isNext) {
    updateBlindsHTML()
  }
}

function updateBlindsHTML(resetBlind) {
  if (resetBlind) {
    currentBlind = 0
  } else {
    currentBlind++
  }
  var nextBlinds = smallBlind[currentBlind] / 2 + '/' + smallBlind[currentBlind]
  document.getElementById("blinds").innerHTML = nextBlinds
  document.getElementById('blindInModal').innerHTML = nextBlinds
}

function switchHidden(hidden, visible) {
  document.getElementById(hidden).hidden = true
  document.getElementById(visible).hidden = false
}