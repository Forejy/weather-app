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
    let week_weathers = document.getElementsByClassName("week__weathers")[0];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


    let tempDay = document.createElement("div");

    let tempMinia = document.createElement("div");
    let tempVCont = document.createElement("div");
    tempMinia.className = "weather-miniature";
    tempMinia.innerHTML = cloud();
    tempVCont.className = "weather-miniature__vcontainer";
    tempMinia.appendChild(tempVCont);

    let tempCont = document.createElement("section");
    tempCont.className = "week__weathers-and-days";
    tempCont.appendChild(tempDay);
    tempCont.appendChild(tempMinia);

    for(let i = 0; i < daysInWeek; i++) {
      tempCont.firstChild.innerText = days[i]; //TODO: Commencer à aujourd'hui
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
