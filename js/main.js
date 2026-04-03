let longitude = 0;
let latitude = 0;
let DataJSON = [];

const dropdownBtns = {
    dropdownBtn: document.getElementById("btn-dpd-menu"),
    dropdownList: document.getElementById("dpd-list"),
};

const forecastElements = {
    results: document.getElementById("results"),
    spinner: document.getElementById("spinner"),
    cityName: document.getElementById("city-name"),
    forecastResultsTitle: document.getElementById("forecast-Results"),
};

async function loadCSV() {
    try {
        const response = await fetch("../city_coordinates.csv");
        const csvData = await response.text();
        return csvData;
    } catch (error) {
        console.error("Error loading CSV file:", error);
        return null;
    }
}

async function fetchWeatherData() {
    try {
        const response = await fetch(`http://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=astro&output=json`);
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

loadCSV().then((csvData) => {
    const jsonData = JSON.stringify(csvData);
    let Data = jsonData.split("\"");
    Data = Data[1].split("\\n");
    Data = Data.map((item) => item.split(",").map((subItem) => subItem.trim()));
    Data.forEach((item) => {
        DataJSON.push({
            lat: item[0],
            lon: item[1],
            city: item[2],
            country: item[3],
        });
    });
    htmlListItems = updateDropdownListItems(DataJSON);
    dropdownBtns.dropdownList.innerHTML = htmlListItems;
}).catch((error) => {
    console.error("Error loading CSV file:", error);
});

function updateDropdownListItems(DataJSON) {
    html = "";
    for (let i = 1; i < DataJSON.length; i++) {
        const city = DataJSON[i].city;
        const country = DataJSON[i].country;
        html += `<li><a class="dropdown-item" href="#" id="${city.toLowerCase()}" value="${city}">${city}, ${country}</a></li>`;
    }
    return html;
}

dropdownBtns.dropdownList.addEventListener("click", (event) => {
    if (event.target.classList.contains("dropdown-item")) {
        const city = event.target.getAttribute("value");
        forecastElements.results.innerHTML = `<div class="spinner-border text-primary d-flex justify-content-center mx-auto my-5"></div>`;
        forecastElements.cityName.innerText = `City of ${city}`;
        const selectedCity = DataJSON.find((item) => item.city === city);
        if (!selectedCity) return;
        longitude = selectedCity.lon;
        latitude = selectedCity.lat;
        fetchWeatherData().then((weatherData) => {
            if (weatherData) {
                forecastElements.forecastResultsTitle.style.display = "block";
                const weatherHTML = generateWeatherHTML(weatherData);
                forecastElements.results.innerHTML = weatherHTML;
                forecastElements.spinner.style.display = "none";
            } else {
                forecastElements.results.innerHTML =
                    "<p class='text-danger text-center'>Failed to load weather data.</p>";
            }
        });
    }
});

function generateWeatherHTML(weatherData) {
    function clean(value, unit = "") {
        return value === -9999 ? "N/A" : `${value}${unit}`;
    }

    const limitedData = weatherData.dataseries.slice(0, 8);

    return `
    <div class="row g-3">
        ${limitedData.map(data => {
        const icon = getWeatherIcon(data);

        return `
            <div class="col-md-3 col-6">
                <div class="card shadow-sm h-100 text-center p-2">

                    <h6 class="fw-bold text-primary">
                        +${data.timepoint}h
                    </h6>

                    <img src="./images/${icon}" 
                         alt="weather icon"
                         style="width: 60px; height: 60px; object-fit: contain;" 
                         class="mx-auto my-2"/>

                    <p class="mb-1">
                       temperature: <strong>${clean(data.temp2m, "°C")}</strong>
                    </p>
                    <p class="mb-1">
                        wind speed: ${clean(data.wind10m?.speed)} m/s
                    </p>

                    <p class="mb-0 small text-muted">
                        wind direction: ${data.wind10m?.direction || "N/A"}
                    </p>

                </div>
            </div>
            `;
    }).join("")}
    </div>
    `;
}

function getWeatherIcon(data) {
    const cloud = data.cloudcover;
    const rain = data.prec_type;

    if (cloud === -9999) return "clear.png";

    if (rain === "rain") {
        if (cloud >= 7) return "rain.png";
        return "lightrain.png";
    }

    if (rain === "snow") {
        return "snow.png";
    }

    if (cloud <= 2) return "clear.png";
    if (cloud <= 5) return "pcloudy.png";
    if (cloud <= 7) return "mcloudy.png";
    return "cloudy.png";
}
