const daysEl =document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minsEl = document.getElementById("mins")
const secondsEl = document.getElementById("seconds")

const newYears = "1 Jan 2025";

function countDown() {
    const newYearDate = new Date(newYears)
    const currentDate = new Date();
    const totalSeconds = (newYearDate - currentDate) / 1000
    
    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;
    //console.log(days, hours, minutes, seconds);
    

    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secondsEl.innerHTML = formatTime(seconds);
}


    function formatTime(time) {
        return time < 10 ? `0${time}` : time;
    }
    
    
    


// initial call
countDown();

setInterval(countDown,1000)