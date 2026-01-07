
const user = JSON.parse(localStorage.getItem("user") || "{}") 

document.body.classList.add("gameBody")
const bodyColor = user?.dom.gameBody.color
if(bodyColor){
    console.log(bodyColor)
    document.body.style.backgroundColor = bodyColor
}

reloadScript("../scripts/store.js")

const game = document.getElementById('game') 
// console.log(getComputedStyle(game).transition.split(' ')[1])
// console.log(parseFloat(getComputedStyle(game).transition.split(' ')[1]))
const timeOutTime = parseFloat(getComputedStyle(game).transition.split(' ')[1]) * 1100 

const heading = document.querySelector('.welcome')
const scoreEl = document.querySelector('.score')
const highestEl = document.querySelector('.highest')
const totalEl = highestEl.nextSibling
const livesEl = document.getElementById("lives")
// const highestEl = scoreEl.nextSibling.nextSibling

const username = user?.name ? user.name : "random"
let score = 0
let highestScore = user?.player?.highScore ? user.player.highScore : 0
let total = user?.player?.total ? user.player.total : 0

heading.textContent = `Welcome, ${username}`
scoreEl.textContent = `Score : ${score}`
highestEl.textContent = `Highest Score : ${highestScore}`
totalEl.textContent = `Total : ${total}`


const checkDisplay = game.style.display === "none"

if(checkDisplay){
    console.log('check')
    game.style.display = "block"
    
    setTimeout(()=>{
     game.style.transform = "scale(1)"
    }, timeOutTime)
}









// Keys
const keys = {}
window.addEventListener("keydown", (e) => {
    keys[e.code] = true
    if (["Space","ArrowUp","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault()
    if (e.code === "KeyR") resetGame()
}, { passive: false })

window.addEventListener("keyup", (e) => {
    keys[e.code] = false
})

// Helpers
const rand = (min, max) => min + Math.random() * (max - min)

function wrap(obj) {
    const w = game.clientWidth
    const h = game.clientHeight

    if (obj.x < 0) obj.x = w
    if (obj.x > w) obj.x = 0
    if (obj.y < 0) obj.y = h
    if (obj.y > h) obj.y = 0
}

function dist(a, b) {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
}

function setPos(el, x, y, rot) {
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}rad)`
}

// Game data
score = 0
let lives = 3

let ship = null
let bullets = []
let asteroids = []

// Create stuff
function makeShip() {
    const el = document.createElement("div")
    el.className = "ship"
    el.classList.add("player")
    const color = user?.dom.player.color
    if(color){
        el.style.borderBottom = `22px solid ${color}`
    }
    game.appendChild(el)

    return {
    el,
    x: game.clientWidth / 2,
    y: game.clientHeight / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    r: 12
    }
}

function makeAsteroid() {
    const el = document.createElement("div")
    el.className = "asteroid"
    game.appendChild(el)

    const r = rand(18, 45)
    el.style.width = (r * 2) + "px"
    el.style.height = (r * 2) + "px"

    // spawn around edges
    const side = Math.floor(rand(0, 4))
    let x = 0, y = 0
    if (side === 0) { x = 0; y = rand(0, game.clientHeight); }
    if (side === 1) { x = game.clientWidth; y = rand(0, game.clientHeight); }
    if (side === 2) { x = rand(0, game.clientWidth); y = 0; }
    if (side === 3) { x = rand(0, game.clientWidth); y = game.clientHeight; }

    const angle = rand(0, Math.PI * 2)
    const speed = rand(40, 120)

    return {
    el,
    x, y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r
    }
}

function shoot() {
    const el = document.createElement("div")
    el.className = "bullet"
    game.appendChild(el)

    const speed = 520

    const b = {
    el,
    x: ship.x,
    y: ship.y,
    vx: ship.vx + Math.cos(ship.angle) * speed,
    vy: ship.vy + Math.sin(ship.angle) * speed,
    life: 0.8,
    r: 3
    }

    bullets.push(b)
}

function updateHUD() {
    scoreEl.textContent = `Score : ${score}`
    livesEl.textContent = `Lives : ${lives}`
}

// Reset
function resetGame() {
    // remove old stuff
    if (ship?.el) ship.el.remove()
    bullets.forEach(b => b.el.remove())
    asteroids.forEach(a => a.el.remove())

    bullets = []
    asteroids = []

    if(highestScore < score){
        highestScore = score
        user.player.highScore = score
        highestEl.textContent = `Highest Score : ${highestScore}`
    }
    total += score
    user.player.total += score
    totalEl.textContent = `Total : ${total}`
    score = 0
    lives = 3

    ship = makeShip()

    for (let i = 0; i < 6; i++) {
    asteroids.push(makeAsteroid())
    }

    updateHUD()
    localStorage.setItem("user", JSON.stringify(user))
}

// Main update
let shootCooldown = 0
let last = performance.now()

function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000)
    last = now

    // ship controls
    const turnSpeed = 4.2   // radians per second
    const thrust = 360      // acceleration
    const friction = 0.99

    if (keys["ArrowLeft"] || keys["KeyA"]) ship.angle -= turnSpeed * dt
    if (keys["ArrowRight"] || keys["KeyD"]) ship.angle += turnSpeed * dt

    if (keys["ArrowUp"] || keys["KeyW"]) {
    ship.vx += Math.cos(ship.angle) * thrust * dt
    ship.vy += Math.sin(ship.angle) * thrust * dt
    }

    ship.vx *= Math.pow(friction, dt * 60)
    ship.vy *= Math.pow(friction, dt * 60)

    // shooting
    shootCooldown -= dt
    if ((keys["Space"]) && shootCooldown <= 0) {
    shoot()
    shootCooldown = 0.18
    }

    // move ship
    ship.x += ship.vx * dt
    ship.y += ship.vy * dt
    wrap(ship)

    // move asteroids
    asteroids.forEach(a => {
    a.x += a.vx * dt
    a.y += a.vy * dt
    wrap(a)
    })

    // move bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i]
    b.life -= dt

    b.x += b.vx * dt
    b.y += b.vy * dt
    wrap(b)

    if (b.life <= 0) {
        b.el.remove()
        bullets.splice(i, 1)
    }
    }

    // bullet hits asteroid
    for (let bi = bullets.length - 1; bi >= 0; bi--) {
    const b = bullets[bi]

    for (let ai = asteroids.length - 1; ai >= 0; ai--) {
        const a = asteroids[ai];

        if (dist(b, a) < (b.r + a.r)) {
        // remove both
        b.el.remove()
        bullets.splice(bi, 1)

        a.el.remove()
        asteroids.splice(ai, 1)

        score += 10
        updateHUD()
        break
        }
    }
    }

    // ship hits asteroid
    for (let ai = asteroids.length - 1; ai >= 0; ai--) {
    const a = asteroids[ai]

    if (dist(ship, a) < (ship.r + a.r)) {
        lives -= 1
        updateHUD()

        // respawn ship
        ship.el.remove()
        ship = makeShip()

        if (lives <= 0) {
        alert("Game Over! Press R to restart")
        // stop movement until restart
        lives = 0
        updateHUD()
        }

        break
    }
    }

    // respawn asteroids if all gone
    if (asteroids.length === 0) {
    for (let i = 0; i < 6; i++) asteroids.push(makeAsteroid())
    }

    // Render (DOM transforms)
    // ship triangle is 24px wide and 22px tall, offset so it centers at ship.x/y
    setPos(ship.el, ship.x - 12, ship.y - 12, ship.angle + Math.PI / 2)

    asteroids.forEach(a => {
    setPos(a.el, a.x - a.r, a.y - a.r, 0)
    })

    bullets.forEach(b => {
    setPos(b.el, b.x - 3, b.y - 3, 0)
    })

    requestAnimationFrame(loop)
}

// start
resetGame()
requestAnimationFrame(loop)

