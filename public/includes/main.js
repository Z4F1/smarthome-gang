let text = [
    "I dag",
    "I morgen"
]

Update()
setInterval(Update, 120000)

function Update(){
    axios.get("/weather")
        .then((res) => {
            let data = res.data
            let today = new Date()
            let date = new Date(data["later"].date.split("T")[0])

            let daysTo = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1

            console.log(data)
            console.log(text[daysTo])

            document.getElementById("temp").innerHTML = data["now"].temperature + "&#176;C"
            document.getElementById("symbol").src = "https://www.yr.no/grafikk/sym/v2017/png/200/" + data["now"].symbol + ".png"
            document.getElementById("wind").innerHTML = data["now"].windSpeed + " fra " + data["now"].windDir

            document.getElementById("later").innerHTML = "<b>" + text[daysTo] + ":</b> " + data["later"].temperature + "&#176;C med " + data["later"].windSpeed + " fra " + data["later"].windDir
        })
        .catch((err) => {
            console.log(err)
        })
}