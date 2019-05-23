// Grabbing DOM Elements
const temperatureDescription = document.querySelector('.temperature-description');
const temperatureDegree = document.querySelector('.temperature-degree');
const locationTimezone = document.querySelector('.location-timezone');
const icon = document.querySelector('#icon');
const unit = document.querySelector('#unit');
const alertDiv = document.querySelector('.alert');
const locationForm = document.querySelector('#location-form');
const locationInput = document.querySelector('#location-input');

// setting eventlisteners:
window.addEventListener("load", () => {
    let lat, long;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // getting location coordinates from browser
            lat = position.coords.latitude;
            long = position.coords.longitude;
            getWeather(lat, long);
        }, error => {
            if (error.code === error.PERMISSION_DENIED) { // handling location access error
                alertDiv.style.display = 'block';
            }
        });
    }
});

// Alternatively changing unit of temperature on click
temperatureDegree.addEventListener('click', () => {
    if (unit.textContent === 'F') {
        unit.textContent = 'C';
        temperatureDegree.textContent = Math.round((temperatureDegree.textContent - 32) * (5 / 9));
    } else {
        unit.textContent = 'F';
        temperatureDegree.textContent = Math.round(((temperatureDegree.textContent * 9) / 5) + 32);
    }
});

// eventlistener for form submit
locationForm.addEventListener('submit', getCoordinates);

// API Calling
function getWeather(lat, long) {
    const proxy = `https://cors-anywhere.herokuapp.com/`;
    const API = `${proxy}https://api.darksky.net/forecast/f36ac08015a2b8528d3c340f562b4d92/${lat},${long}`;
    fetch(API)
        .then(response => response.json())
        .then(response => {
            // console.log(response);
            const { temperature, summary, icon } = response.currently;

            // Setting DOM Elements from API
            temperatureDegree.textContent = Math.round(temperature);
            unit.textContent = 'F';
            temperatureDescription.textContent = summary;
            locationTimezone.textContent = response.timezone;

            // setting icon
            const skycons = new Skycons({ "color": "white", "resizeClear": true, });
            const currentIcon = icon.replace(/-/g, "_").toUpperCase();
            skycons.play();
            skycons.set("icon", Skycons[currentIcon]);

        })
        .catch(error => {
            alertDiv.textContent = 'Some error occurred';
            alertDiv.style.display = 'block';
            setTimeout(() => {
                alertDiv.style.display = 'none';
                alertDiv.textContent = 'Please provide give access to location!!';
            }, 2000);  
        });
}

// Calling API to fetch coordinates
function getCoordinates(event) {
    event.preventDefault();
    // console.log('works');
    var inputVal = locationInput.value;
    fetch(`https://us1.locationiq.com/v1/search.php?key=90e5c08064449e&q=${inputVal}&format=json`)
        .then(response => response.json())
        .then(response => {
            // console.log(response);            
            const { lat, lon } = response[0]; // fetching latitude and longitude from the API
            getWeather(lat, lon);
        })
        .catch(error => {
            alertDiv.textContent = 'Some error occurred';
            alertDiv.style.display = 'block';
            setTimeout(() => {
                alertDiv.style.display = 'none';
                alertDiv.textContent = 'Please provide give access to location!!';
            }, 2000);
        }); 
    locationInput.value = "";
}