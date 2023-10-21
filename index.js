const userTab = document.querySelector("[user-weather-container]");
const serachTab= document.querySelector("[serach-weather-container]");
const userConatiner =document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector("[grant-location-container]");
const searchForm =document.querySelector("[data-search-from]");
const loadingScreen=  document.querySelector(".loading-screen-container");
const userInfoContainer = document.querySelector(".user-info-container");
const apicalled = document.querySelector(".api-called-failed")


const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
 let currentTab = userTab;
 getFromSessionStorage();

 function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            userTab.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage()
        }
    }
 }
 currentTab.classList.add("current-tab");
 userTab.addEventListener("click",()=>{
    switchTab(userTab)
 });

 serachTab.addEventListener("click", () =>{
    switchTab(serachTab)
 });

 function  getFromSessionStorage(){
     
      const localCoordinates = sessionStorage.getItem("user-coordinates");
      if(!localCoordinates){
        grantAccessContainer.classList.add("active");
        userInfoContainer.classList.remove("active")
        apicalled.classList.remove("active");
      }else{
        const coordinates =JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
     
      }
}

 async function fetchWeatherInfo(coordinates){
   const {lat , lon} = coordinates;
   grantAccessContainer.classList.remove("active");
   apicalled.classList.remove("active");
   loadingScreen.classList.add("active");
   try{
    const response= await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    apicalled.classList.remove("active");
    randerInfo(data);
   }
   catch(err){
    //loadingScreen.classList.remove("active")//
    console.log("results not found");
   }
   
}

function randerInfo(weatherInfo) {
 const cityName = document.querySelector("[data-cityName]");
 const countryIcon = document.querySelector("[data-countryIcon]");
 const weatherDescription = document.querySelector("[data-weatherDesc]");
 const weatherIcon = document.querySelector("[data-weatherIcon]");
 const temparature = document.querySelector("[ data-temp]");
 const windSpeed = document.querySelector("[data-wind-speed]");
 const humidity = document.querySelector("[data-humidity]");
 const clouds = document.querySelector("[data-cloudiness]");


 cityName.innerText = weatherInfo?.name;
 countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
 weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
 weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
 temparature.innerText =`${weatherInfo?.main?.temp}°C`;
 windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
 humidity.innerText = `${weatherInfo?.main?.humidity}%`;
 clouds.innerText = `${weatherInfo?.clouds?.all}%`;

}
function getLocation(){
   if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(showPosition);
   }else{
      console.log("no geolocation support");
   }
}
function showPosition(position){
   const userCoordinates={
      lat: position.coords.latitude,
      lon:position.coords.longitude,
   }
   sessionStorage.setItem("user-coordinates" ,JSON.stringify(userCoordinates));
   fetchWeatherInfo(userCoordinates);
}
const btnControl = document.querySelector("[data-grantAccess]");
btnControl.addEventListener("click", getLocation);

let searchInput=document.querySelector("[dataSearch-input]");

searchForm.addEventListener("submit",(e)=>{
   e.preventDefault();
   let cityName = searchInput.value;
   if(cityName ==="")
      return;
   else
   fetchSearchWeatherInfo(cityName);
   
   
})
async function fetchSearchWeatherInfo(city){
   loadingScreen.classList.add("active");
   grantAccessContainer.classList.remove("active");
   userInfoContainer.classList.remove("active");
   try{ 
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if(response.ok){
     const data = await response.json();
     loadingScreen.classList.remove("active");
     userInfoContainer.classList.add("active");
     apicalled.classList.remove("active");
     
     
     randerInfo(data);
   }else{
      userInfoContainer.classList.remove("active");
      loadingScreen.classList.remove("active");
      apicalled.classList.add("active");

   }
   }
   catch(err){
      userInfoContainer.classList.remove("active")
   }
     
   
   
}
