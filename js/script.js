// Grabbing DOM Elements
const temperatureDescription = document.querySelector('.temperature-description');
const temperatureDegree = document.querySelector('.temperature-degree');
const locationTimezone = document.querySelector('.location-timezone');
const icon = document.querySelector('#icon');
const unit = document.querySelector('#unit');
const alertDiv = document.querySelector('.alert');

// setting eventlisteners:
window.addEventListener("load", () => {
    let lat, long;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            // getting location coordinates fro, browser
            lat = position.coords.latitude;
            long = position.coords.longitude;
            APICall(lat, long);
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

})

// API Calling
function APICall(lat, long) {
    // const proxy = `https://cors-anywhere.herokuapp.com/`;
    const API = `https://api.darksky.net/forecast/f36ac08015a2b8528d3c340f562b4d92/${lat},${long}`;
    fetch(API)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            const { temperature, summary, icon } = response.currently;

            // Setting DOM Elements from API
            temperatureDegree.textContent = Math.round(temperature);
            temperatureDescription.textContent = summary;
            locationTimezone.textContent = response.timezone;

            // setting icon
            const skycons = new Skycons({ "color": "white", "resizeClear": true, });
            const currentIcon = icon.replace(/-/g, "_").toUpperCase();
            skycons.play();
            skycons.set("icon", Skycons[currentIcon]);

        });
}