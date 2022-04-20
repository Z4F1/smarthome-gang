let text = {
    "E": "øst",
    "N": "nord",
    "S": "sør",
    "W": "vest",
    "NW": "nordvest",
    "NE": "nordøst",
    "SE": "sørøst",
    "SW": "sørvest"
}

Update()
setInterval(Update, 60000)
FastUpdate()
setInterval(FastUpdate, 5000)

function Update(){
    axios.get("/weather")
        .then((res) => {
            let data = res.data

            document.getElementById("temp").innerHTML = data["now"].temperature + "&#176;C"
            document.getElementById("wind").innerHTML = data["now"].windSpeed + " fra " + text[data["now"].windDir]
            document.getElementById("clouds").innerHTML = data["now"].cloudiness + "% skyer"

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