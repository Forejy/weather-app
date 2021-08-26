function useless(size) {
  const scale = [2.94117647059, 3.333, 5];
  // let calcScale = [size/scale[0], size/scale[1], size/scale[2]];
  let baseFrequency = 0.04;
  let calcScale = 10;

  const cloudSVG = "<div class=\"cloud\" id=\"cloud-white\"></div><svg width=\"0\" height=\"0\"><filter id=\"filter-back\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"" + baseFrequency + "\" numOctaves=\"4\"/><feDisplacementMap  in=\"SourceGraphic\" scale=\"" + calcScale + "\" /></filter><</svg>"

  return cloudSVG;
}

async function appendFirstPart() {
  const response = await callWeatherAPI("current");
  // const weather = response[2];
  const weather = 803;
  const dayOrNight = response[3];

  const moonContainer = document.getElementById("js-moon-container");
  const sunContainer = document.getElementById("js-sun-container");
  const cloudsContainer = document.getElementById("js-clouds-container");
  const oneCloudContainer = document.getElementById("js-one-cloud-container");
  const twoCloudContainer = document.getElementById("js-two-clouds-container"); //TODO: Refacto : est-ce que je peux éviter de définir les variables à chaque fois que la fonction est appelée ? Avec une fonction alternative qui return les variables necessaires seulement pour éviter de réécrire du code ?
  const filterBack = document.getElementById("test");

  if (dayOrNight === 'd') {
    // moonContainer.classList.remove("d-none");
  }
  else {
    // sunContainer.classList.remove("d-none");
  }
  if (weather === 800) {
    sunContainer.classList.remove("d-none");
  }
  else if (weather === 801) {
    cloudsContainer.classList.add("sun-cloud--one-cloud-subcontainer");
    sunContainer.classList.add("sun-cloud--sun-container");
    // oneCloudContainer.firstChild.id = "cloud-white-s3";
    filterBack.setAttribute("seed", 3);
    oneCloudContainer.firstChild.classList.remove("d-none");
    oneCloudContainer.classList.remove("d-none");
    cloudsContainer.classList.remove("d-none");
    sunContainer.classList.remove("d-none");
  }
  else if (weather === 802) {
    cloudsContainer.classList.add("one-cloud--clouds-container");
    cloudsContainer.classList.remove("d-none");
    oneCloudContainer.classList.remove("d-none");
    oneCloudContainer.firstChild.classList.remove("d-none");
  }
  else if (weather === 803) {
    cloudsContainer.classList.remove("d-none");
    cloudsContainer.classList.add("two-clouds--clouds-container");
    // oneCloudContainer.classList.remove("d-none");
    twoCloudContainer.classList.remove("d-none");
    filterBack.setAttribute("baseFrequency", 0.014);

  }
}

appendFirstPart();


async function appendTemperatureAndWeather() {
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

appendTemperatureAndWeather();
appendWeathersToWeek();


async function appendTemperaturesToDay() {

  let containerDayTemperatures = document.getElementById("js-day-temperatures");

  let containerTemperatureText = document.getElementById("js-day-temperatures__text");
  let containerHours = document.getElementById("js-hours");

  // I. Initialise le Graphique
  let containerGraphic = document.getElementById("js-day-temperatures__temperatures");

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
      time = time === 23 ? 0 : time + 1;
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
      containerTransition.classList.remove("informations-trans__translateXless100");

      leftToRightTimeout2 = setTimeout(function () {
        containerTransition.classList.remove( "informations-trans__trans2");
      } , 2001);
    }

    containerTransition.classList.add("informations-trans__translateXless100", "informations-trans__trans2");

    // rightToleftTimeout = setTimeout(function () {
    //   day.classList.add("d-none");
    //   containerTransition.classList.remove("informations-trans__translateXless100", "informations-trans__trans2");
    // } , 2000);
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

  let json =
  {
    "lat":45.6484,"lon":-0.1562,"timezone":"Europe/Paris","timezone_offset":7200,"current":{"dt":1629809794,"sunrise":1629781933,"sunset":1629831249,"temp":24.1,"feels_like":24.08,"pressure":1020,"humidity":58,"dew_point":15.33,"uvi":5.98,"clouds":75,"visibility":10000,"wind_speed":4.02,"wind_deg":30,"wind_gust":7.6,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}]},"hourly":[{"dt":1629806400,"temp":24.47,"feels_like":24.38,"pressure":1020,"humidity":54,"dew_point":14.56,"uvi":6.34,"clouds":62,"visibility":10000,"wind_speed":6.85,"wind_deg":53,"wind_gust":8.21,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"pop":0},{"dt":1629810000,"temp":24.1,"feels_like":24.08,"pressure":1020,"humidity":58,"dew_point":15.33,"uvi":5.98,"clouds":75,"visibility":10000,"wind_speed":6.37,"wind_deg":59,"wind_gust":7.81,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"pop":0},{"dt":1629813600,"temp":24.85,"feels_like":24.77,"pressure":1019,"humidity":53,"dew_point":14.63,"uvi":4.79,"clouds":61,"visibility":10000,"wind_speed":5.65,"wind_deg":61,"wind_gust":7.53,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"pop":0},{"dt":1629817200,"temp":25.91,"feels_like":25.78,"pressure":1018,"humidity":47,"dew_point":13.74,"uvi":3.23,"clouds":47,"visibility":10000,"wind_speed":5.17,"wind_deg":56,"wind_gust":7.53,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"pop":0},{"dt":1629820800,"temp":26.9,"feels_like":26.84,"pressure":1018,"humidity":41,"dew_point":12.55,"uvi":1.75,"clouds":33,"visibility":10000,"wind_speed":6.25,"wind_deg":49,"wind_gust":7.72,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"pop":0},{"dt":1629824400,"temp":27.02,"feels_like":26.88,"pressure":1016,"humidity":40,"dew_point":12.28,"uvi":0.7,"clouds":22,"visibility":10000,"wind_speed":7.55,"wind_deg":55,"wind_gust":8.11,"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"pop":0},{"dt":1629828000,"temp":25.49,"feels_like":25.17,"pressure":1016,"humidity":41,"dew_point":11.15,"uvi":0.17,"clouds":15,"visibility":10000,"wind_speed":6.99,"wind_deg":59,"wind_gust":10.77,"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"pop":0},{"dt":1629831600,"temp":23.22,"feels_like":22.72,"pressure":1017,"humidity":43,"dew_point":9.98,"uvi":0,"clouds":3,"visibility":10000,"wind_speed":5.55,"wind_deg":53,"wind_gust":11.56,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629835200,"temp":22.52,"feels_like":21.9,"pressure":1017,"humidity":41,"dew_point":8.46,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":6.53,"wind_deg":47,"wind_gust":13.33,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629838800,"temp":21.33,"feels_like":20.56,"pressure":1018,"humidity":40,"dew_point":7.17,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":6.74,"wind_deg":49,"wind_gust":13.42,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629842400,"temp":19.95,"feels_like":19.12,"pressure":1018,"humidity":43,"dew_point":7,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":6.2,"wind_deg":51,"wind_gust":13.28,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629846000,"temp":18.41,"feels_like":17.59,"pressure":1017,"humidity":49,"dew_point":7.37,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":5.45,"wind_deg":48,"wind_gust":12.14,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629849600,"temp":16.82,"feels_like":16.02,"pressure":1017,"humidity":56,"dew_point":7.9,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.91,"wind_deg":43,"wind_gust":10.89,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629853200,"temp":15.61,"feels_like":14.87,"pressure":1017,"humidity":63,"dew_point":8.4,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.79,"wind_deg":42,"wind_gust":10.4,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629856800,"temp":14.66,"feels_like":13.98,"pressure":1017,"humidity":69,"dew_point":9.04,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.68,"wind_deg":40,"wind_gust":10.26,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629860400,"temp":13.78,"feels_like":13.22,"pressure":1016,"humidity":77,"dew_point":9.65,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.45,"wind_deg":39,"wind_gust":9.94,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629864000,"temp":13.26,"feels_like":12.81,"pressure":1016,"humidity":83,"dew_point":10.28,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.63,"wind_deg":37,"wind_gust":10.72,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629867600,"temp":13.03,"feels_like":12.66,"pressure":1016,"humidity":87,"dew_point":10.78,"uvi":0,"clouds":0,"visibility":10000,"wind_speed":4.75,"wind_deg":38,"wind_gust":11.5,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629871200,"temp":13.74,"feels_like":13.39,"pressure":1017,"humidity":85,"dew_point":11.26,"uvi":0.14,"clouds":0,"visibility":10000,"wind_speed":5.34,"wind_deg":38,"wind_gust":12.86,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629874800,"temp":16.31,"feels_like":15.95,"pressure":1017,"humidity":75,"dew_point":11.79,"uvi":0.6,"clouds":0,"visibility":10000,"wind_speed":6.26,"wind_deg":46,"wind_gust":12.74,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629878400,"temp":19.39,"feels_like":18.98,"pressure":1017,"humidity":61,"dew_point":11.74,"uvi":1.54,"clouds":0,"visibility":10000,"wind_speed":7.09,"wind_deg":54,"wind_gust":11.42,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629882000,"temp":22.26,"feels_like":21.82,"pressure":1016,"humidity":49,"dew_point":10.87,"uvi":2.91,"clouds":0,"visibility":10000,"wind_speed":7.68,"wind_deg":56,"wind_gust":10.85,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629885600,"temp":24.49,"feels_like":24.04,"pressure":1016,"humidity":40,"dew_point":9.96,"uvi":4.5,"clouds":0,"visibility":10000,"wind_speed":7.72,"wind_deg":58,"wind_gust":9.73,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629889200,"temp":26.3,"feels_like":26.3,"pressure":1015,"humidity":34,"dew_point":9.12,"uvi":5.68,"clouds":0,"visibility":10000,"wind_speed":7.33,"wind_deg":59,"wind_gust":8.64,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629892800,"temp":27.61,"feels_like":26.82,"pressure":1014,"humidity":30,"dew_point":8.36,"uvi":6.15,"clouds":0,"visibility":10000,"wind_speed":6.74,"wind_deg":56,"wind_gust":7.69,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629896400,"temp":28.59,"feels_like":27.4,"pressure":1014,"humidity":27,"dew_point":7.78,"uvi":5.8,"clouds":0,"visibility":10000,"wind_speed":6.14,"wind_deg":54,"wind_gust":6.81,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629900000,"temp":29.14,"feels_like":27.74,"pressure":1013,"humidity":25,"dew_point":7.29,"uvi":4.64,"clouds":0,"visibility":10000,"wind_speed":5.68,"wind_deg":51,"wind_gust":6.3,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629903600,"temp":29.28,"feels_like":27.85,"pressure":1013,"humidity":25,"dew_point":7.02,"uvi":3.12,"clouds":0,"visibility":10000,"wind_speed":5.47,"wind_deg":48,"wind_gust":6.03,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629907200,"temp":29.02,"feels_like":27.64,"pressure":1013,"humidity":25,"dew_point":7.08,"uvi":1.71,"clouds":0,"visibility":10000,"wind_speed":5.38,"wind_deg":49,"wind_gust":5.91,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629910800,"temp":28.16,"feels_like":27.12,"pressure":1013,"humidity":28,"dew_point":7.99,"uvi":0.68,"clouds":0,"visibility":10000,"wind_speed":5.2,"wind_deg":48,"wind_gust":6.1,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629914400,"temp":25.61,"feels_like":25.14,"pressure":1013,"humidity":35,"dew_point":8.91,"uvi":0.17,"clouds":0,"visibility":10000,"wind_speed":4.67,"wind_deg":46,"wind_gust":8.77,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629918000,"temp":22.18,"feels_like":21.52,"pressure":1014,"humidity":41,"dew_point":8.16,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":4.12,"wind_deg":43,"wind_gust":8.72,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629921600,"temp":20.81,"feels_like":20.1,"pressure":1014,"humidity":44,"dew_point":8,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":4.21,"wind_deg":40,"wind_gust":10.63,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629925200,"temp":19.53,"feels_like":18.79,"pressure":1014,"humidity":48,"dew_point":8.17,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":4.22,"wind_deg":41,"wind_gust":11.96,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629928800,"temp":18.79,"feels_like":18.08,"pressure":1015,"humidity":52,"dew_point":8.62,"uvi":0,"clouds":2,"visibility":10000,"wind_speed":4.5,"wind_deg":44,"wind_gust":12.24,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629932400,"temp":18.1,"feels_like":17.43,"pressure":1015,"humidity":56,"dew_point":9.14,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":4.6,"wind_deg":43,"wind_gust":11.8,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629936000,"temp":17.39,"feels_like":16.78,"pressure":1015,"humidity":61,"dew_point":9.63,"uvi":0,"clouds":1,"visibility":10000,"wind_speed":4.65,"wind_deg":43,"wind_gust":11.04,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629939600,"temp":16.72,"feels_like":16.14,"pressure":1014,"humidity":65,"dew_point":10.14,"uvi":0,"clouds":3,"visibility":10000,"wind_speed":4.65,"wind_deg":40,"wind_gust":10.55,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629943200,"temp":15.97,"feels_like":15.48,"pressure":1014,"humidity":71,"dew_point":10.55,"uvi":0,"clouds":4,"visibility":10000,"wind_speed":4.53,"wind_deg":40,"wind_gust":10.21,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629946800,"temp":15.26,"feels_like":14.8,"pressure":1014,"humidity":75,"dew_point":10.82,"uvi":0,"clouds":4,"visibility":10000,"wind_speed":4.47,"wind_deg":39,"wind_gust":10.31,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629950400,"temp":14.69,"feels_like":14.28,"pressure":1014,"humidity":79,"dew_point":11.04,"uvi":0,"clouds":5,"visibility":10000,"wind_speed":4.38,"wind_deg":37,"wind_gust":10.35,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629954000,"temp":14.08,"feels_like":13.71,"pressure":1015,"humidity":83,"dew_point":11.05,"uvi":0,"clouds":6,"visibility":10000,"wind_speed":4.41,"wind_deg":34,"wind_gust":10.48,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"pop":0},{"dt":1629957600,"temp":14.41,"feels_like":14.02,"pressure":1015,"humidity":81,"dew_point":11.19,"uvi":0.14,"clouds":6,"visibility":10000,"wind_speed":4.8,"wind_deg":33,"wind_gust":10.97,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629961200,"temp":16.8,"feels_like":16.39,"pressure":1015,"humidity":71,"dew_point":11.45,"uvi":0.63,"clouds":6,"visibility":10000,"wind_speed":5.56,"wind_deg":40,"wind_gust":9.69,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629964800,"temp":19.61,"feels_like":19.19,"pressure":1015,"humidity":60,"dew_point":11.53,"uvi":1.64,"clouds":7,"visibility":10000,"wind_speed":5.9,"wind_deg":41,"wind_gust":8.38,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629968400,"temp":22.31,"feels_like":21.93,"pressure":1015,"humidity":51,"dew_point":11.55,"uvi":3.11,"clouds":8,"visibility":10000,"wind_speed":6.26,"wind_deg":38,"wind_gust":7.81,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629972000,"temp":24.52,"feels_like":24.15,"pressure":1015,"humidity":43,"dew_point":11.35,"uvi":4.69,"clouds":8,"visibility":10000,"wind_speed":6.32,"wind_deg":39,"wind_gust":7.13,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0},{"dt":1629975600,"temp":26.36,"feels_like":26.36,"pressure":1015,"humidity":38,"dew_point":11.13,"uvi":5.94,"clouds":8,"visibility":10000,"wind_speed":6.03,"wind_deg":39,"wind_gust":6.61,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"pop":0}],"daily":[{"dt":1629806400,"sunrise":1629781933,"sunset":1629831249,"moonrise":1629836040,"moonset":1629788640,"moon_phase":0.57,"temp":{"day":24.47,"min":13.75,"max":27.02,"night":21.33,"eve":25.49,"morn":14.47},"feels_like":{"day":24.38,"night":20.56,"eve":25.17,"morn":14.43},"pressure":1020,"humidity":54,"dew_point":14.56,"wind_speed":7.55,"wind_deg":55,"wind_gust":13.42,"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":62,"pop":0,"uvi":6.34},{"dt":1629892800,"sunrise":1629868407,"sunset":1629917543,"moonrise":1629923580,"moonset":1629879180,"moon_phase":0.6,"temp":{"day":27.61,"min":13.03,"max":29.28,"night":19.53,"eve":25.61,"morn":13.74},"feels_like":{"day":26.82,"night":18.79,"eve":25.14,"morn":13.39},"pressure":1014,"humidity":30,"dew_point":8.36,"wind_speed":7.72,"wind_deg":58,"wind_gust":13.28,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":0,"pop":0,"uvi":6.15},{"dt":1629979200,"sunrise":1629954881,"sunset":1630003836,"moonrise":1630011180,"moonset":1629969540,"moon_phase":0.63,"temp":{"day":27.9,"min":14.08,"max":30.1,"night":20.8,"eve":26.18,"morn":14.41},"feels_like":{"day":27.22,"night":20.29,"eve":26.18,"morn":14.02},"pressure":1014,"humidity":34,"dew_point":10.61,"wind_speed":6.32,"wind_deg":39,"wind_gust":13.37,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":7,"pop":0,"uvi":6.43},{"dt":1630065600,"sunrise":1630041354,"sunset":1630090128,"moonrise":1630098780,"moonset":1630059840,"moon_phase":0.66,"temp":{"day":22.85,"min":11.27,"max":25.19,"night":17.65,"eve":22.63,"morn":11.27},"feels_like":{"day":22.05,"night":16.78,"eve":21.84,"morn":10.52},"pressure":1017,"humidity":33,"dew_point":5.61,"wind_speed":6.11,"wind_deg":33,"wind_gust":13.28,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":0,"pop":0,"uvi":6.37},{"dt":1630152000,"sunrise":1630127828,"sunset":1630176419,"moonrise":1630186560,"moonset":1630150200,"moon_phase":0.69,"temp":{"day":23.72,"min":10.94,"max":25.43,"night":15.79,"eve":21.71,"morn":10.94},"feels_like":{"day":23.09,"night":14.97,"eve":21.01,"morn":10.2},"pressure":1019,"humidity":36,"dew_point":7.82,"wind_speed":6.42,"wind_deg":47,"wind_gust":12.6,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":0,"pop":0,"uvi":6.24},{"dt":1630238400,"sunrise":1630214302,"sunset":1630262710,"moonrise":0,"moonset":1630240440,"moon_phase":0.72,"temp":{"day":25.14,"min":11.65,"max":26.56,"night":16.69,"eve":21.97,"morn":11.68},"feels_like":{"day":24.65,"night":16.06,"eve":21.37,"morn":11.31},"pressure":1016,"humidity":36,"dew_point":9.08,"wind_speed":7.18,"wind_deg":32,"wind_gust":12.84,"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":0,"pop":0,"uvi":7},{"dt":1630324800,"sunrise":1630300775,"sunset":1630349000,"moonrise":1630274460,"moonset":1630330680,"moon_phase":0.75,"temp":{"day":26.32,"min":11.8,"max":27.92,"night":18.98,"eve":24.27,"morn":11.8},"feels_like":{"day":26.32,"night":18.11,"eve":23.61,"morn":11.25},"pressure":1012,"humidity":30,"dew_point":7.58,"wind_speed":5.65,"wind_deg":57,"wind_gust":12.35,"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":37,"pop":0,"uvi":7},{"dt":1630411200,"sunrise":1630387249,"sunset":1630435289,"moonrise":1630362720,"moonset":1630420740,"moon_phase":0.78,"temp":{"day":25.37,"min":14.99,"max":26.56,"night":16.93,"eve":21.12,"morn":16.47},"feels_like":{"day":25.58,"night":17.19,"eve":21.43,"morn":16.03},"pressure":1012,"humidity":62,"dew_point":17.58,"wind_speed":4.14,"wind_deg":53,"wind_gust":8.7,"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":99,"pop":0.88,"rain":3.01,"uvi":7}]
  }

  try {
    // let request = await fetch(url);
    // let response = await request.json();
    response = json;

    if (timespan === 'current') {
      let tempResponse = response.current
      return [Math.round(tempResponse.temp), tempResponse.weather[0].description, tempResponse.weather[0].id, tempResponse.weather[0].icon.slice(-1)]
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