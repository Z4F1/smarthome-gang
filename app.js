const express = require("express")
const app = express()

const morgan = require("morgan")
const axios = require("axios")
const xmlParser = require("xml-js")

let weather = {
}

app.use(morgan("short"))

app.use(express.static(__dirname + "/public"))

app.get("/weather", (req, res) => {
    res.json(weather)
})

app.listen(3000, ()=> {
    console.log("Listening to *3000")

    Update()
    setInterval(Update, 60000)
})

function Update(){
    axios.get("https://www.yr.no/sted/Norge/postnummer/3440/varsel.xml")
        .then((res) => {
            let data = xmlParser.xml2js(res.data, {compact:true, space: 4})
            let temp = null

            for(let i = 0; i < data.weatherdata.forecast.tabular.time.length; i++){
                if(data.weatherdata.forecast.tabular.time[i]._attributes.period == "2"){
                    temp = data.weatherdata.forecast.tabular.time[i]
                    break;
                }
            }

            weather.temperature = temp.temperature._attributes.value
            weather.info = temp.symbol._attributes.name
            weather.symbol = temp.symbol._attributes.var
            weather.windDir = temp.windDirection._attributes.name
            weather.windSpeed = temp.windSpeed._attributes.name
            weather.date = new Date(temp._attributes.from)

            console.log("Weather successfull!")
        })
        .catch((err) => {
            console.log(err)
        })
}