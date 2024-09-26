const apikey = "5705c860e60375cc7c1e2700bb728466";
const url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;



const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");


async function getWeatherByLocation(city) {
    const resp = await fetch(url(city), {
        origin: "cors" });
    const respData = await resp.json();
    addWeatherToPage(respData, city);
}

getWeatherByLocation();


function addWeatherToPage(data) {
    const temp = KtoC(data.main.temp);

    const weather = document.createElement("div");
    weather.classList.add("weather");

    weather.innerHTML = `
    <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
        <small>${data.weather[0].main}</small>   
    `;
    // clean up
    main.innerHTML = "";

    main.appendChild(weather);
    
}

function KtoC(K) {
    return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;

    if (city) {
        getWeatherByLocation(city);
    }
    
})
  