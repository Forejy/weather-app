async function callWeatherAPI(APIkey) {
  let city = 'Angouleme';
  let country = 'fr'
  let url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "," + country + "&appid=" + APIkey;
  let call = await fetch(url).then(response => response.json());
  await console.log(call);
  await fetch(url).then(response => response.json()).then(data => console.log(data));

  let response = await fetch(url);

  console.log(response.body);
  console.log(response.bodyUsed);
  console.log(response.ok);
  console.log(response.redirected);
  console.log(response.status);
  console.log(response.statusTexte);

  let ret = await response.json();
  console.log(ret);


}