function cloud(size) {
const scale = [2.94117647059, 3.333, 5];
// let calcScale = [size/scale[0], size/scale[1], size/scale[2]];
let baseFrequency = 0.04;
let calcScale = 10;

const cloudSVG = "<div class=\"cloud\" id=\"cloud-back\"></div><svg width=\"0\" height=\"0\"><filter id=\"filter-back\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"" + baseFrequency + "\" numOctaves=\"4\"/><feDisplacementMap  in=\"SourceGraphic\" scale=\"" + calcScale + "\" /></filter><</svg>"

return cloudSVG;
}

async function appendTemperature() {
  const weather = await callWeatherAPI("current");

  const temperatureCityContainer = document.getElementsByClassName('temperature-city__text')[0];
  const temperatureContainer = temperatureCityContainer.firstChild;
  const weatherContainer = temperatureCityContainer.lastChild;
  const tempeStr = weather[0].toString();
  const weatherStr = weather[1];
  let fragment = document.createDocumentFragment();
  let len = tempeStr.length;

  let parent = document.createElement("div");
  let child = document.createElement("div");
  parent.appendChild(child);

  for (var i = 0; i < len; i++) {
    parent.firstChild.innerText = tempeStr[i];
    parent.firstChild.style.paddingTop = i * 0 +"%";
    parent.firstChild.style.lineHeight = ".5em";

    fragment.appendChild(parent);
    parent = parent.cloneNode(true);
  }
  temperatureContainer.appendChild(fragment);

  let deg = parent.cloneNode();
  deg.className = "temperature-weather";
  deg.innerText = "°";
  temperatureContainer.appendChild(deg);

  weatherStr[0].toUpperCase();
  weatherContainer.innerText = weatherStr.charAt(0).toUpperCase() + weatherStr.slice(1);
}


async function appendWeathersToWeek() {
  const daysInWeek = 7;
  let week_weathers = document.getElementById("js-week");
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date().getDay();
  const days = daysOfWeek.slice(today).concat(daysOfWeek.slice(0, today));
  const temperatures =  await callWeatherAPI("daily");

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


async function appendTemperaturesToDay() {

  let containerDayTemperatures = document.getElementById("js-day-temperatures");

  let containerTemperatureText = document.getElementById("js-day-temperatures__text");
  let containerHours = document.getElementById("js-hours");

  // I. Initialise le Graphique
  let containerGraphic = document.getElementById("js-day-temperatures__temperatures");

  // const dayTemperatures = [25, 30, 30, 26, 25, 30, 25, 35, 30];
  const dayTemperatures =  await callWeatherAPI("hourly");
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
        containerTransition.classList.add("informations-trans__trans2"); //TODO: Si je reclique après que la première transition se soit terminée (et non pendant), la seconde transition ne se fait pas, l'item prend brutalement la place de l'autre.
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




async function fetchText() {
  const strFile = "../APIkey.txt";
  let response = await fetch(strFile);
  let data = await response.text();
  return data;
}

async function callWeatherAPI(timespan) {

  let APIkey;
  try {
    APIkey = await fetchText();
  }
  catch (err) {
    console.log("Erreur lors de l'ouverture d'APItext.txt : " + err)
  }

  let lat = 45.6484
  let lon = 0.1562
  let url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=-" + lon + "&units=metric" + "&exclude=minutely&appid=" + APIkey;

  try {
    let request = await fetch(url);
    let response = await request.json();

    if (timespan === 'current') {
      return [Math.round(response.current.temp), response.current.weather[0].description]
    }
    else if (timespan === 'hourly') {
      let responseHourly = await response.hourly;
      let temperatures = [];
      temperatures = Array.from(responseHourly.slice(0, 9).map(object => Math.round(object.temp)))

      return temperatures;
    }
    else { //daily
      let responseDaily = await response.daily;
      let temperatures = [];
      temperatures = Array.from(responseDaily.slice(0, 7).map(object => Math.round(object.temp.day)))

      return temperatures;
    }
  } catch (err) {
    console.log("Erreur lors de la tentative de fetch l'api openweather : " + err);
  }
}








// TODO: Raccorder le graphic maker aux donnéees
// TODO: Afficher le numéro de l'erreur à la place des graphiques