// console.log("test")

// const user = {}

console.log(state, "game")
document.body.classList.add("gameBody")

const gameDiv = document.getElementById('game') 
const timeOutTime = parseFloat(getComputedStyle(gameDiv).transition.split(' ')[1]) * 1100 
const heading = document.querySelector('h1')
const username = state?.name
heading.textContent = `Welcome, ${username ? username : "Random"}`

gameDiv.style.display = "flex"

setTimeout(()=>{
 gameDiv.style.transform = "scale(1)"
}, timeOutTime)
