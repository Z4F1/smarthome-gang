const express = require("express")
const app = express()

const morgan = require("morgan")
const axios = require("axios")
const xmlParser = require("xml-js")

let weather = {
    "now": {},
    "later": {}
}

app.use(morgan("short"))

app.use(express.static(__dirname + "/public"))

app.get("/weather", (req, res) => {
    res.json(weather)
})

app.listen(3000, ()=> {
    console.log("Listening to *3000")

    Update()
    setInterval(Update, 120000)
})

function Update(){
    axios.get("https://www.yr.no/sted/Norge/postnummer/3440/varsel_time_for_time.xml")
        .then((res) => {
            let data = xmlParser.xml2js(res.data, {compact:true, space: 4})
            let temp = data.weatherdata.forecast.tabular.time[0]

            weather["now"].temperature = temp.temperature._attributes.value
            weather["now"].info = temp.symbol._attributes.name
            weather["now"].symbol = temp.symbol._attributes.var
            weather["now"].windDir = temp.windDirection._attributes.name
            weather["now"].windSpeed = temp.windSpeed._attributes.name
            weather["now"].date = new Date(temp._attributes.from)

            console.log("Weather now successfull!")

            temp = null

            for(let i = 0; i < data.weatherdata.forecast.tabular.time.length; i++){
                if(data.weatherdata.forecast.tabular.time[i]._attributes.from.split("T")[1] == "15:00:00"){
                    temp = data.weatherdata.forecast.tabular.time[i]
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