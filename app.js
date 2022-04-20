const express = require("express")
const app = express()

const morgan = require("morgan")
const axios = require("axios")
const xmlParser = require("xml-js")

const { DeviceDiscovery, Sonos } = require('sonos')

let weather = {
    "now": {},
    "later": {}
}

let sonos = {
    "artist": "",
    "title": "",
    "state": ""
}

app.use(morgan("short"))

app.use(express.static(__dirname + "/public"))

app.get("/weather", (req, res) => {
    res.json(weather)
})

app.get("/sonos", (req, res) => {
    res.json(sonos);
})

app.listen(3000, ()=> {
    console.log("Listening to *3000")

    Update()
    setInterval(Update, 120000)

    FastUpdate()
    setInterval(FastUpdate, 5000)
})

function Update(){
    axios.get("https://api.met.no/weatherapi/locationforecast/2.0/classic?lat=59.7484259&lon=10.3603469", {headers: {"User-Agent": "SmartSpeil pelle.pastoor@hotmail.com"}})
        .then((res) => {
            let data = xmlParser.xml2js(res.data, {compact:true, space: 4})
	    console.log(data)
            let temp = data.weatherdata.product.time[0].location

            weather["now"].temperature = temp.temperature._attributes.value
            weather["now"].windDir = temp.windDirection._attributes.name
            weather["now"].windSpeed = temp.windSpeed._attributes.name
            weather["now"].date = new Date(data.weatherdata.product.time[0])

            console.log("Weather now successfull!")

            temp = null

            for(let i = 0; i < data.weatherdata.product.time.length; i++){
                if(data.weatherdata.product.time[i]._attributes.from.split("T")[1] == "15:00:00"){
                    temp = data.weatherdata.product.time[i].location
                    break;
                }
            }

            weather["later"].temperature = temp.temperature._attributes.value
            weather["later"].info = temp.symbol._attributes.name
            weather["later"].symbol = temp.symbol._attributes.var
            weather["later"].windDir = temp.windDirection._attributes.name
            weather["later"].windSpeed = temp.windSpeed._attributes.name
            weather["later"].date = new Date(temp._attributes.from)

            console.log("Weather later successfull!")
        })
        .catch((err) => {
            console.log(err)
        })
}

function FastUpdate(){
    DeviceDiscovery(function(){ this.destroy() }).once('DeviceAvailable', async (devices) => {
        const groups = await devices.getAllGroups()
        let device
        for (let group of groups){
            if(group.Name.includes("Family Room")){
                device = new Sonos(group.host, group.port)
            }
        }
        const state = await device.getCurrentState()
        const track = await device.currentTrack()
        if (track.duration && track.duration != 0){
            sonos["title"] = track.title
            sonos["artist"] = track.artist
        }
        if(state == "playing"){
            sonos["state"] = state
        }else {
            sonos["state"] = "paused"
        }
    })
}

