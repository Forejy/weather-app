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

  for (var i = 0; i < len; i++)
  {
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

function appendDaysToWeek() {
  const daysInWeek = 7;

  function appendDays() {
    let week_days = document.getElementsByClassName('week__days')[0];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let tempChild = document.createElement("div");
    for(let i = 0; i < daysInWeek; i++) {
      tempChild.innerText = days[i]; //TODO: Commencer à aujourd'hui
      week_days.appendChild(tempChild);
      tempChild = tempChild.cloneNode();
    }
  }

  function appendWeathersToWeek() {
    let week_weathers = document.getElementById("js-week");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const temperatures = ["29°", "30°", "31°", "30°", "30°", "29°", "29°"];


    let tempDay = document.createElement("div");
    // let tempDay_ = document.createElement("span");
    tempDay.className = "week__day";
    // tempDay.appendChild(tempDay_);


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

  function appendTemperatures() {
    let week_temperatures = document.getElementsByClassName("week__temperatures")[0];
  }

  appendWeathersToWeek();
}

appendTemperature();
appendDaysToWeek();


function changeDayOrWeek() {
  const switchContainer = document.getElementById("js-switch-subcontainer");
  let opacity = 0;
  let transfer = ["0px", "3px"]

  switchContainer.addEventListener("click", function(){
    // Switch Button
    switchContainer.style.paddingLeft = transfer[opacity];
    opacity = opacity === 0 ? 1 : 0;
    switchContainer.style.paddingRight = transfer[opacity]
    switchContainer.style.setProperty('--switch-b--opacity', opacity);

    let informations = document.getElementById("informations").children;
    let words = document.getElementsByClassName("day-week__text__words");
    for(let i = 0; i < 2; i++) {
      words[i].classList.toggle("text-white");
    }
    // Transition 1
    informations[0].classList.remove("d-none");
    informations[1].classList.add("translateX-100notrans");

    // setTimeout(function () {
      // informations[0].classList.remove("translateX-100");
      // informations[1].classList.remove("translateX-100notrans");
    // }
    // , 2000);

    // setTimeout(function () {
    //   informations[0].classList.remove("translateX-100");
    // }
    // , 2500);

    // setTimeout(function () {
    //   informations[1].classList.add("d-none");
    //   informations[1].classList.add("translateX-173");
    // }
    // , 2000);




    // setTimeout(function () {



    //   informations[0].classList.remove("translateX100");
    //   informations[0].classList.remove("d-none");
    // }
    // , 10);
    // setTimeout(function () {
    //   informations[0].classList.remove("translateX-100")
    //   informations[1].classList.add("translateX100");
    // }
    // , 100);
    // setTimeout(function () {
    //   informations[1].classList.add("d-none");
    // }
    // , 3000);

  })
}

changeDayOrWeek()

function dayTemperatures() {

  let containerTemperatureText = document.getElementById("js-day-temperatures__text");
  let containerHours = document.getElementById("js-hours");

  // I. Initialize Graphic
  let containerGraphic = document.getElementById("js-day-temperatures__temperatures");

  const dayTemperatures = [25, 30, 30, 26, 25, 30, 25, 35, 30];
  const max = Math.max(...dayTemperatures);
  const range = max - Math.min(...dayTemperatures);
  const tempTextDecalage = 3;
  const containerBig = document.getElementById("informations");
  const wContainer = containerBig.clientWidth - parseInt(window.getComputedStyle(containerBig).paddingLeft) - parseInt(window.getComputedStyle(containerBig).paddingRight);
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

  // II. Initialize Text
  let elem = document.createElement("div");
  elem.style.cssText = "flex-shrink:0;position:relative;width:" + wPart + "px;left:-6px;";

  let fragment = document.createDocumentFragment();

  for(let i = 1; i < dayTemperatures.length; i++) {
    // Create Graphic
    y2 = (max - dayTemperatures[i]) * hPart;
    let path = "<path style=\"fill: none; stroke: #eee\" d=\"M" + x1 + "," + y1 + " C" + xC + "," + y1 + " " + xC + "," + y2 + " " + x2 + "," + y2 + "\" /></path></svg>";
    tempStr += svgPart + path;

    // Create Text
    elem.style.top = (y1) + "px";
    elem.innerText = dayTemperatures[i - 2] !== dayTemperatures[i - 1] ?dayTemperatures[i - 1] + "°" : "";
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




dayTemperatures();


