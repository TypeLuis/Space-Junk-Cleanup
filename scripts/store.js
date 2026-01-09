// const user = JSON.parse(localStorage.getItem("user") || "{}") 

const storeButton = document.querySelector("button")

storeButton.addEventListener("click", (e) => {
    createModal()
})

function createModal(){
    const main = document.createElement("main")
    main.classList.add("modal")
    main.id = "myModal"

    const modalContent = document.createElement('div')
    modalContent.classList.add("modal-content")

    const close = document.createElement("span")
    close.innerHTML = "&times;"
    close.classList.add("close")

    main.appendChild(modalContent)
    modalContent.appendChild(close)
    document.body.appendChild(main)

    storeItems(modalContent)
    main.style.display = "block"
    modalContent.style.top = 0
    requestAnimationFrame(() =>  modalContent.style.top = "50%")
    
    close.addEventListener("click", () => {
        modalContent.style.top = 0
        modalContent.addEventListener("transitionend", () => {
            main.style.display = "none"
        }, {once: true})
    })
}


function storeItems(modalContent){
    const items = Object.keys(user?.dom)

    if(items){
        for(let item of items){
            const content = document.createElement('div')
            content.classList.add('items')

            const button = document.createElement("button")
            const itemToBuy = document.createElement("span")

            // console.log(user?.dom[item].cost, user?.dom[item])
            button.addEventListener("click", () => handleClick(item))

            button.textContent = user?.dom[item].cost
            itemToBuy.textContent = item

            content.appendChild(itemToBuy)
            content.appendChild(button)
            modalContent.appendChild(content)

        }
    }

}

function handleClick(item){
    const currency = user?.player.total
    const cost = user?.dom[item].cost
    if (cost > currency) return


    const color = prompt("pick a color")
    const target = document.querySelector(`.${item}`)

    if (!target || !color) return


    user.player.total -= cost
    totalEl.textContent = `Total : ${user.player.total}`
    user.dom[item].color = color
    localStorage.setItem("user", JSON.stringify(user))

    if (item === "player") {
        target.style.borderBottom = `22px solid ${color}`
      } else {
        target.style.backgroundColor = color
      }
}

// storeItems()

{/* <section id="myModal" class="modal">

<div style="--alignment:center" class="modal-content">
  <span class="close">&times;</span>
</div>

</section> */}

// {"name":"Test","dom":{"gameBody":"","player":""},"player":{"highScore":250,"total":270}}