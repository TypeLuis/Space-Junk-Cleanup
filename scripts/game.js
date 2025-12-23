
const user = JSON.parse(localStorage.getItem("user") || "{}") 

document.body.classList.add("gameBody")


const gameDiv = document.getElementById('game') 
// console.log(getComputedStyle(gameDiv).transition.split(' ')[1])
// console.log(parseFloat(getComputedStyle(gameDiv).transition.split(' ')[1]))
const timeOutTime = parseFloat(getComputedStyle(gameDiv).transition.split(' ')[1]) * 1100 

const heading = document.querySelector('.welcome')
const scoreEl = document.querySelector('.score')
const highestEl = scoreEl.nextSibling

const username = user?.name ? user.name : "random"
let score = 0
let highestScore = user?.highScore ? user.highScore : 0

heading.textContent = `Welcome, ${username}`
scoreEl.textContent = `Score : ${score}`
highestEl.textContent = `Highest Score : ${highestScore}`


const checkDisplay = gameDiv.style.display === "none"

if(checkDisplay){
    console.log('check')
    gameDiv.style.display = "block"
    
    setTimeout(()=>{
     gameDiv.style.transform = "scale(1)"
    }, timeOutTime)
}



