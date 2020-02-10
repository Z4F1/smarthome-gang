let text = [
    "I dag",
    "I morgen"
]

axios.get("/weather")
    .then((res) => {
        let data = res.data
        let today = new Date()
        let date = new Date(data.date)

        let daysTo = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) + 1

        console.log(data)
        console.log(text[daysTo])
    })
    .catch((err) => {
        console.log(err)
    })