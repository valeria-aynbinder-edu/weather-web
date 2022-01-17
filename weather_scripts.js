GO_BTN_ID = "go_button"
CITY_INPUT_ID = 'city-input'
WEATHER_DATA_DIV = 'weather-data'
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather?appid=91201722ff1cc4a99e9c870bbbe2aafb&units=metric&q="

//cities cache
displayingCities = []

function onCityKeyPress(e) {
    console.log("Called onCityKeyPress")
    if(e.keyCode == 13) { //Enter
        console.log("Detected Enter press")
        sendRequest()
    }
}

function onCityKeyDown(e) {
    console.log("Called onCityKeyDown", e.keyCode)
}

function onCityInput(e) {
    input_val = e.target.value
    console.log("Called onCityInput: ", input_val)
    if (input_val.length > 0) {
        document.getElementById(GO_BTN_ID).disabled = false
    }
}

function getCityName() {
    return document.getElementById(CITY_INPUT_ID).value
}

function getGoBtn() {
    return document.getElementById(GO_BTN_ID)
}

function getIconUrl(iconCode) {
    //f"city{}dsjhsd"
    //return "http://openweathermap.org/img/wn/" + iconCode + "@2x.png"
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`
}

function createCityBox(city, icon, temp) {
    // we want to dynamically build this element
    // <div class="weather-data-div">
    //     <h3>London</h3>
    //     <div class="city-inner-div">
    //         <img src="http://openweathermap.org/img/wn/10d@2x.png">
    //         <h2>5°</h2>
    //     </div>
    // </div>

    // <div></div>
    cityDiv = document.createElement("div")

    // <div class="weather-data-div"
    cityDiv.className = "weather-data-div"

    // <h3></h3>
    cityNameh3 = document.createElement("h3")
    
    // London
    cityTextNode = document.createTextNode(city)

    // <h3>London</h3>
    cityNameh3.appendChild(cityTextNode)

    // <div></div>
    innerDiv = document.createElement("div")
    innerDiv.className = 'city-inner-div'


    iconImg = document.createElement("img")
    iconImg.src = getIconUrl(icon)

    tempH2 = document.createElement("h2")
    tempH2.appendChild(document.createTextNode(temp + "°"))

    innerDiv.appendChild(iconImg)
    innerDiv.appendChild(tempH2)

    cityDiv.appendChild(cityNameh3)
    cityDiv.appendChild(innerDiv)

    document.getElementById(WEATHER_DATA_DIV).appendChild(cityDiv);

    //update cache
    displayingCities.push(city)
}

function updateWeatherDetails(city, newIcon, newTemp) {

    //find the relevant div
    elements = document.getElementsByClassName("weather-data-div")
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        elemCity = element.getElementsByTagName('h3')[0].innerHTML
        if (elemCity.toLowerCase() == city.toLowerCase()) {
            //make updates
            element.getElementsByTagName("img")[0].src = getIconUrl(newIcon)
            element.getElementsByTagName("h2")[0].innerHTML = newTemp + "°"

            break
        }   
    }
}

function responseHandler(response) {
    if (!response.ok) {
        throw new Error('Network response was not OK');
    }
    return response.json()
}

function sendRequest() {
    
    console.log("inside onclick")
    city = getCityName()
    console.log('Sending request for ', city)

    // disable Go button
    getGoBtn().disabled = true

    // solution for ex. 1
    document.getElementById(CITY_INPUT_ID).value = ""

    // add spinner

    //send request using fetch + promise
    fetch(WEATHER_URL + city)
    // .then(responseHandler)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json()
    })
    .then(jsonContent => {
        console.log("Received response for city ", city)
        console.log(jsonContent)

        // get needed data
        weather_desc = jsonContent.weather[0].main
        icon = jsonContent.weather[0].icon
        temp = Math.round(jsonContent.main.temp)

        //if city in displayingCities
        if (displayingCities.includes(city)) {
            // update existing box
            updateWeatherDetails(city, icon, temp)
        } else {
            // draw a new box
            createCityBox(city, icon, temp)
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
    console.log(displayingCities)
}

async function sendRequestWithAsync() {
    console.log("inside onclick")
    city = getCityName()
    console.log('Sending request for ', city)

    // disable Go button
    getGoBtn().disabled = true

    //waits for response to arrive, meanwhile returns control to UI thread
    try {
            const response = await fetch(WEATHER_URL + city);
            if (!response.ok) {
                //waits to load json, after request arrived, meanwhile returns control to UI thread
                
                const jsonContent = await response.json();
                console.log("Received response for city ", city)
                console.log(jsonContent)

                // get needed data
                weather_desc = jsonContent.weather[0].main
                icon = jsonContent.weather[0].icon
                temp = Math.round(jsonContent.main.temp)

                if (displayingCities.includes(city)) {
                    // update existing box
                    updateWeatherDetails(city, icon, temp)
                } else {
                    // draw a new box
                    createCityBox(city, icon, temp)
                }
            }
    } catch(error) {
        console.log('ERROR!!!!', error)
    }
  }