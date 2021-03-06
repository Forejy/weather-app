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

  function appendWeathers() {
    let week_weathers = document.getElementById("js-week");
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const temperatures = ["29°", "30°", "31°", "30°", "30°", "29°", "29°"];


    let tempDay = document.createElement("div");
    tempDay.className = "week__day";

    let tempMinia = document.createElement("img");
    let tempMiniaCont = document.createElement("div");
    let tempTemperature = document.createElement("div");
    tempMinia.src = "../media/cloud3.svg";
    tempMinia.width = "30";
    tempTemperature.className = "week__temperature";
    tempMiniaCont.className = "weather-miniature__vcontainer";
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

  appendWeathers();
}

appendTemperature();
appendDaysToWeek();


function changeDayOrWeek() {
  const switchContainer = document.getElementById("js-switch-subcontainer");
  switchContainer.addEventListener("click", function(){
    let informations = document.getElementById("informations").children;
    let words = document.getElementsByClassName("day-week__text__words");
    for(let i = 0; i < 2; i++) {
      words[i].classList.toggle("text-white");
      informations[i].classList.toggle("d-none");
    }
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
  const wContainer = document.getElementById("informations").clientWidth;
  let hContainer = document.getElementById("informations").clientHeight - parseInt(window.getComputedStyle(containerTemperatureText).lineHeight) - parseInt(window.getComputedStyle(containerHours).lineHeight) - parseInt(window.getComputedStyle(containerHours).marginTop);
  containerGraphic.style.height = hContainer + "px";
  const wPart = (wContainer / (dayTemperatures.length - 1)) - 1;
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
    elem.style.top = (y1 - 3) + "px";
    elem.innerText = dayTemperatures[i - 2] !== dayTemperatures[i - 1] ?dayTemperatures[i - 1] + "°" : "";
    fragment.appendChild(elem);
    elem = elem.cloneNode();

    y1 = y2; // (Pour les deux)
  }
  elem.style.top = (y1 - 3) + "px";
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