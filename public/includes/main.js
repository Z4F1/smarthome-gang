let text = [
    "I dag",
    "I morgen"
]

Update()
setInterval(Update, 60000)
FastUpdate()
setInterval(FastUpdate, 5000)

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

function FastUpdate(){
    axios.get("/sonos")
        .then((res) => {
            let data = res.data

            document.getElementById("sonos-track").innerHTML = "<b>" + data["title"] + ",</b> by " + data["artist"]
            document.getElementById("sonos-icon").src = "/includes/icons/" + data["state"] + ".png"
        })
}

setInterval(()=>{
    const time = new Date()
    
    let hour = time.getHours()
    if(time.getHours() < 10){
        hour = "0" + time.getHours()
    }

    let min = time.getMinutes()
    if(time.getMinutes() < 10){
        min = "0" + time.getMinutes()
    }

    let sec = time.getSeconds()
    if(time.getSeconds() < 10){
        sec = "0" + time.getSeconds()
    }

    const t = hour + ":" + min + "." + sec

    document.getElementById("time").innerHTML = t
}, 500)