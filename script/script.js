
const APIKEY           = '87d28833dc3008f114e8dc330dadfe18';
const ENDPOINT_CITY    = 'http://api.openweathermap.org/geo/1.0/direct?q=';
const ENDPOINT_WEATHER = 'http://api.openweathermap.org/data/2.5/weather?';
const UNITS            = 'metric';
const LANGUAGE         = 'pt_br';

let   LATITUDE      = null;
let   LONGITUDE     = null;

function initiateApp(){
  document.getElementById("search").value = '';
  LATITUDE  = null;
  LONGITUDE = null;
  CITYNAME  = null;
  getLocation();
}

function getLocation(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(position => {
      setLatLong(position.coords.latitude,position.coords.longitude);
      searchWeather();
      //CITYNAME = search.value ;
      //searchImageCity();
      searchWeather();

    });
  } else {
    alert('Não é possível buscar a localização automática. Por favor, utilize a opção "Buscar cidade.');
  }
}

function getCity(){
  let search = document.getElementById("search").value;
  if (validateSeach(search)){
    searchCity(search);
  } else {
    alert("Digite o nome da cidade!")
  }
}

function validateSeach(search){
  return search !== '';
}

function searchCity(search){
  const promise = axios.get (`${ENDPOINT_CITY}${search}&appid=${APIKEY}`);
  promise.then(checkSearchCitySuccess);
  promise.catch(checkSearchCityError);
}

function checkSearchCitySuccess(response){
  let search = document.getElementById("search");
  if (response.data.length === 0){
    alert("Cidade não encontrada! Digite novamente.")
    search.value = '';
    search.focus();
  } else {
    setLatLong(response.data[0].lat,response.data[0].lon);
    search.value = `${response.data[0].name.toUpperCase()}`;
    searchWeather();
  }
}

function setLatLong(lat,long){
  LATITUDE = lat;
  LONGITUDE = long;
}

function checkSearchCityError(error){
  alert(`Não foi possível completar a execução. Contate o administrador do sistema com o código do erro: ${error.response.status}!`);
  console.log(error.response);
}

function searchImageCity(cidade){
  const options = {
    method: 'GET',
    url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/ImageSearchAPI',
    params: {
      q: cidade,
      pageNumber: '1',
      pageSize: '10',
      autoCorrect: 'false',
      safeSearch: 'true'
    },
    headers: {
      'x-rapidapi-host': 'contextualwebsearch-websearch-v1.p.rapidapi.com',
      'x-rapidapi-key': '4ca795e2aamsh0b52564ef3b5840p17340fjsncdf7a6db3ff6'
    }
  };
  
  axios.request(options)
    .then(searchImageCitySuccess)
    .catch(error => console.log(error.response) );
}

function searchImageCitySuccess(response){
  const images = response.data.value;
  let urlImage = null;
  for (let i=0; i< images.length; i++){
    if (images[i].url.substring(images[i].url.length-3,images[i].url.length).toUpperCase() === 'JPG'){
      urlImage = images[i].url;
      break;
    }
  }
  renderCityImage(urlImage);
}

function renderCityImage(urlImage){
  const aside = document.querySelector('aside');
  aside.innerHTML = `<img src="${urlImage}" alt="${CITYNAME}"/> `
}

function searchWeather(){
  const promise = axios.get(`${ENDPOINT_WEATHER}lat=${LATITUDE}&lon=${LONGITUDE}&appid=${APIKEY}&units=${UNITS}&lang=${LANGUAGE}`);
  promise.then(checkSearchWeatherSuccess);
  promise.catch(checkSearchWeatherError);
}

function checkSearchWeatherSuccess(response){
  setWeatherInfo(response);
}

function checkSearchWeatherError(error){
  alert(`Não foi possível completar a execução. Contate o administrador do sistema com o código do erro: ${error.response.status}!`);
  console.log(error.response);
}

function setWeatherInfo(response){
  const weather   = response.data;
  console.log(weather);
  const cidade    = weather.name;
  const tempAtual = weather.main.temp.toFixed(0);
  const sensacao  = weather.main.feels_like.toFixed(0);
  const tempMin   = weather.main.temp_min.toFixed(0);
  const tempMax   = weather.main.temp_max.toFixed(0);
  const tempo     = weather.weather[0].description;
  
  setWeatherImage(weather.weather[0].main);

  renderWeatherInfo(cidade,tempAtual,sensacao,tempMin,tempMax,tempo);
}

function renderWeatherInfo(cidade,tempAtual,sensacao,tempMin,tempMax,tempo){
  const main = document.querySelector('main');

  main.innerHTML  = `<div class="cidade"   >${cidade}<div>`;
  main.innerHTML += `<div class="tempAtual">${tempAtual}º C<div>`;
  main.innerHTML += `<div class="tempo"    >(${tempo})<div>`;
  main.innerHTML += `<div class="sensacao" >Sensação térmica:   ${sensacao}º C<div>`;
  main.innerHTML += `<div class="tempMin"  >Temperatura mínima: ${tempMin}º C<div>`;
  main.innerHTML += `<div class="tempMax"  >Temperatura máxima: ${tempMax}º C<div>`;
  
  searchImageCity(cidade);
}

function setWeatherImage(main){
  if (main === 'Clouds'){
    console.log("aaaaaaaaa");
  }
}

initiateApp();