function cloud(size) {
const scale = [2.94117647059, 3.333, 5];
// let calcScale = [size/scale[0], size/scale[1], size/scale[2]];
let baseFrequency = 0.04;
let calcScale = 10;

const cloudSVG = "<div class=\"cloud\" id=\"cloud-back\"></div><svg width=\"0\" height=\"0\"><filter id=\"filter-back\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"" + baseFrequency + "\" numOctaves=\"4\"/><feDisplacementMap  in=\"SourceGraphic\" scale=\"" + calcScale + "\" /></filter><</svg>"

return cloudSVG;
}

function appendTemperature() {
  const temperatureContainer = document.getElementsByClassName('temperature-container')[0];
  const tempstr = "35°"
  let fragment = document.createDocumentFragment();
  let len = tempstr.length - 1;

  let parent = document.createElement("div");
  let child = document.createElement("div");
  parent.appendChild(child);

  for (var i = 0; i < len; i++) {
    parent.firstChild.innerText = tempstr[i];
    parent.firstChild.style.paddingTop = i * 0 +"%";
    parent.firstChild.style.lineHeight = ".5em";

    fragment.append(parent);
    parent = parent.cloneNode(true);
  }
  temperatureContainer.appendChild(fragment);

  let deg = parent.cloneNode();
  deg.className = "temperature";
  deg.innerText = tempstr.substring(i);
  temperatureContainer.appendChild(deg);
}


function appendWeathersToWeek() {
  const daysInWeek = 7;
  let week_weathers = document.getElementById("js-week");
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const temperatures = ["29°", "30°", "31°", "30°", "30°", "29°", "29°"];

  let tempDay = document.createElement("div");
  tempDay.className = "week__day";

  let tempMinia = document.createElement("img");
  let tempMiniaCont = document.createElement("div");
  let tempTemperature = document.createElement("div");
  tempMinia.src = "../media/cloud3.svg";
  tempMinia.className = "weather-miniature__img";
  tempTemperature.className = "week__temperature";
  tempMiniaCont.className = "weather-miniature__container-img";
  tempMiniaCont.append(tempMinia);

  let tempCont = document.createElement("section");
  tempCont.className = "week__weathers-and-days";
  tempCont.appendChild(tempDay);
  tempCont.appendChild(tempMiniaCont);
  tempCont.appendChild(tempTemperature)

  for(let i = 0; i < daysInWeek; i++) {
    tempCont.firstChild.innerText = days[i]; //TODO: Commencer à aujourd'hui
    tempCont.lastChild.innerText = temperatures[i];
    week_weathers.appendChild(tempCont);
    tempCont = tempCont.cloneNode(true);
  }
}

appendTemperature();
appendWeathersToWeek();


function transformDayOrWeek() {
  const switchContainer = document.getElementById("js-switch-subcontainer");
  const containerTransition = document.getElementById("container-transition");
  const day = containerTransition.children[0];
  const week = containerTransition.children[1]
  let opacity = 0;
  const transfer = ["0px", "3px"];
  let leftToRightTimeout1;
  let leftToRightTimeout2;
  let rightToleftTimeout;

  function changeSwitchButton() {
    switchContainer.style.paddingLeft = transfer[opacity];
    opacity = opacity === 0 ? 1 : 0;
    switchContainer.style.paddingRight = transfer[opacity];
    document.getElementsByClassName("switch-lpart")[0].style.setProperty('transition', "2s");
    switchContainer.style.setProperty('--switch-b--opacity', opacity);

    ;
    let words = document.getElementsByClassName("day-week__text__words");

    for(let i = 0; i < 2; i++) {
      words[i].classList.toggle("text-white");
    }
  }

  switchContainer.addEventListener("click", function rightToleft() {
    this.removeEventListener("click", rightToleft);
    clearTimeout(leftToRightTimeout1);
    clearTimeout(leftToRightTimeout2);
    changeSwitchButton();

    switchContainer.addEventListener("click", leftToRight);

    function leftToRight() {
      changeSwitchButton();
      clearTimeout(rightToleftTimeout);

      this.removeEventListener("click", leftToRight);
      switchContainer.addEventListener("click", rightToleft);

      day.classList.remove("d-none");
      containerTransition.classList.add("informations-trans__translateXless100");

      leftToRightTimeout1 = setTimeout(function () {
        containerTransition.classList.add("informations-trans__trans2");
        containerTransition.classList.remove("informations-trans__translateXless100");
      } , 1);

      leftToRightTimeout2 = setTimeout(function () {
        week.classList.add("d-none");
        containerTransition.classList.remove( "informations-trans__trans2");
      } , 2001);
    }

    week.classList.remove("d-none");
    containerTransition.classList.add("informations-trans__translateXless100", "informations-trans__trans2");

    rightToleftTimeout = setTimeout(function () {
      day.classList.add("d-none");
      containerTransition.classList.remove("informations-trans__translateXless100", "informations-trans__trans2");
    } , 2000);
  });
}

transformDayOrWeek();

function appendTemperaturesToDay() {

  let containerDayTemperatures = document.getElementById("js-day-temperatures");

  let containerTemperatureText = document.getElementById("js-day-temperatures__text");
  let containerHours = document.getElementById("js-hours");

  // I. Initialise le Graphique
  let containerGraphic = document.getElementById("js-day-temperatures__temperatures");

  const dayTemperatures = [25, 30, 30, 26, 25, 30, 25, 35, 30];
  const max = Math.max(...dayTemperatures);
  const range = max - Math.min(...dayTemperatures);
  const tempTextDecalage = 3;
  const containerBig = document.getElementById("informations");
  const wContainer = containerDayTemperatures.clientWidth - parseInt(window.getComputedStyle(containerDayTemperatures).paddingLeft) - parseInt(window.getComputedStyle(containerDayTemperatures).paddingRight);
  let hContainer = containerBig.clientHeight - (parseInt(window.getComputedStyle(containerTemperatureText).lineHeight) + tempTextDecalage) - parseInt(window.getComputedStyle(containerHours).lineHeight) - parseInt(window.getComputedStyle(containerHours).marginTop);
  containerGraphic.style.height = hContainer + "px";
  const wPart = (wContainer / ((dayTemperatures.length - 1))); //-1 parce que j'affiche les temperatures par 2 consécutivement;
  const hPart = hContainer / range;

  let tempStr = "";
  let svgPart = "<svg width=\"" + wPart + "\" height=" + hContainer + " viewBox=\"0 0 " + wPart + " " + hContainer + "\"" + "\>";
  let y1 = (max - dayTemperatures[0]) * hPart; //yC1 = y1;
  let y2; // yC2 = y2;
  let x1 = 0;
  let x2 = wPart; //
  let xC = wPart / 2; //xC1 = xC2

  // II. Initialise le Texte
  let elem = document.createElement("div");
  elem.style.cssText = "flex-shrink:0;position:relative;width:" + wPart + "px;left:-6px;";

  let fragment = document.createDocumentFragment();

  for(let i = 1; i < dayTemperatures.length; i++) {
    // Créer le Graphique
    y2 = (max - dayTemperatures[i]) * hPart;
    let path = "<path style=\"fill: none; stroke: #eee\" d=\"M" + x1 + "," + y1 + " C" + xC + "," + y1 + " " + xC + "," + y2 + " " + x2 + "," + y2 + "\" /></path></svg>";
    tempStr += svgPart + path;

    // Créer le Texte
    elem.style.top = (y1) + "px";
    elem.innerText = dayTemperatures[i - 1] + "°";
    fragment.appendChild(elem);
    elem = elem.cloneNode();

    y1 = y2; // (Pour les deux)
  }
  elem.style.top = (y1) + "px";
  elem.innerText = dayTemperatures[dayTemperatures.length - 1] + "°";
  fragment.appendChild(elem);

  containerGraphic.innerHTML = tempStr;
  containerTemperatureText.appendChild(fragment);

  function dayHours() {
    let time = new Date().getHours();
    let fragment = document.createDocumentFragment();

    let elem = document.createElement("div");
    elem.style.cssText = "flex-shrink: 0; width:" + wPart + "px;";

    for(let i = 0; i < dayTemperatures.length; i++) {
      elem.innerText = (time <= 9 ? "0" + time : time) + ":00";
      time = time + 1;
      fragment.appendChild(elem);

      elem = elem.cloneNode();
    }
    containerHours.appendChild(fragment);
  }
  dayHours();
}

appendTemperaturesToDay();



function handleWeatherInfo() {

  // let test = fetch(strFile).then(function(response) { console.log(response.responseType)});
  // let test2 = fetch(strFile).then(function(response) {
      // response.body.getReader().read().then(function processText({done, value}) {
        // console.log(value)
      // })
  // });
  // let test2 = fetch(strFile).then(response => response.text())
  // .then(temp = function(text) {
  //     return text;
  //   });
  //   console.log(temp());

  // let test3 = fetch(strFile).then(temp = function(response) {
  //   return response.text();
  // }
  // );

  // var temp;
  // let test3 = function testThen() {
  //   fetch(strFile).then(function(response) {
  //     response.text().then(function(text) {
  //       console.log(text);
  //       temp = text;
  //       console.log(temp);
  //     })
  //   });
  // }


  let strFile = "../APIkey.txt";

  async function fetchText() {
    let response = await fetch(strFile);
    let data = await response.text();
    callWeatherAPI(data);
  }

  // let ret = fetchText();
  // let ret2 = ret.then(function(data) {
  //   return data;
  // })

  async function callWeatherAPI(APIkey) {
    // let city = 'Angouleme';
    // let country = 'fr'
    // let url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&appid=" + APIkey;

    let lat = 45.6484
    let lon = 0.1562
    let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=-" + lon + "&units=metric" + "&exclude=minutely&appid=" + APIkey;

    console.log(url)

    try {
      let response = await fetch(url);
      console.log(await response.json());
    } catch (err) {
      console.log(err);
    }

  }

  fetchText();

// TODO: Raccorder le graphic maker aux donnéees
// TODO: Afficher le numéro de l'erreur à la place des graphiques














  // let test2 = fetch(strFile).then(response => response.text())
  // .then(response => console.log(response));

  // test2.body.getReader();
  // fetch('https://url.com/some/url')
  // .then(function(response) {
  //   // Successful response :)
  // })
  // .catch(function(err) {
  //   // Error :(
  // });
}

handleWeatherInfo();