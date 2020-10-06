const KEY = 'INSERT-API-KEY-HERE';
let city;

// ANIMATION
let cloud1 = document.querySelector('#cloud1');
scroll = window.pageYOffset;
document.addEventListener('scroll', function(e){
  let offset = window.pageYOffset;
  scroll = offset;
  cloud1.style.right = (-20+scroll/15)+'%';
});

let cloud2 = document.querySelector('#cloud2');
document.addEventListener('scroll', function(e){
  let offset = window.pageYOffset;
  scroll = offset;
  cloud2.style.left = (30 + scroll/15) +'%';
});

let sun = document.querySelector('#sun');
document.addEventListener('scroll', function(e){
  let offset = window.pageYOffset;
  scroll = offset;
  sun.style.bottom = (-30 + scroll/10) +'%';
});

let card = document.querySelector('.card');
card.addEventListener('click', function(){
  if(card.style.transform === 'rotateY(180deg)'){
    card.style.transform = 'rotateY(0deg)';
  }
  else{
    card.style.transform = 'rotateY(180deg)';
  }
});

// REQUESTS

function getCoords(){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function (position){
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      $.getJSON('https://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid='+KEY+'', function(response){
        city = response.city.name;
        setInfo(response, 0);
      });
    });
  }
  else {
    alert('Geolocation is not supported by this browser!')
  }
}

getCoords();

let input = document.querySelector('#city-input');
input.addEventListener('keyup', function(e){
  if(e.keyCode === 13){
    city = e.target.value;
    e.target.value = '';
    getMeteo(city, 0);
  }
});

function getMeteo(city_name, index){
  $.getJSON('https://api.openweathermap.org/data/2.5/forecast?q='+city_name+'&appid='+KEY+'').then(function(response){
    setInfo(response, index);
  }).catch(function(e){
    if(e.status === 404){
      alert("Ops! City not found.");
    }
    else{
      alert("Ops! Something gone wrong.");
    }
  });
}

function setInfo(response, index){
    if(index === 0){
      for(let i = 2; i <= 8; i+= 2){
        let future_main = response.list[i].weather[0].main;
        let future_img = document.querySelector(".h"+i*3 + " img");
        future_img.src = "icons/"+future_main +".svg";
      }
    }
    let data = response.list[index];
    let name = response.city.name;
    let country = response.city.country;
    let degrees = (data.main.temp - 273.15).toFixed(2) + '°';
    let humidity = data.main.humidity + '%';
    let cloudiness = data.clouds.all + '%';
    let wind = data.wind.speed + 'km/h';
    let pressure = data.main.pressure +'hPa';
    let main = data.weather[0].main;

    $(".meteo").css("display", "block");
    let city = document.querySelector('#city-name');
    city.textContent = name + ', ' + country;
    let degreesField = document.querySelector('#deg');
    degreesField.textContent = degrees;
    let humidityField = document.querySelector('#humidity');
    humidityField.textContent = ' ' + humidity;
    let cloudinessField = document.querySelector('#cloudiness');
    cloudinessField.textContent = ' ' + cloudiness;
    let windField = document.querySelector('#wind-speed');
    windField.textContent = ' ' + wind;
    let pressureField = document.querySelector('#pressure');
    pressureField.textContent = ' ' + pressure;

    let img = document.querySelector('#current-img');
    img.src = 'icons/' + main + '.svg';
}

// IMAGES
let h6 = document.querySelector('.h6');
h6.addEventListener('click', function(){
  getMeteo(city, 2);
});
let h12 = document.querySelector('.h12');
h12.addEventListener('click', function(){
  getMeteo(city, 4);
});
let h18 = document.querySelector('.h18');
h18.addEventListener('click', function(){
  getMeteo(city, 6);
});
let h24 = document.querySelector('.h24');
h24.addEventListener('click', function(){
  getMeteo(city, 8);
});
