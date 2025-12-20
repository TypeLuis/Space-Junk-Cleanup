
// console.log(email, user)

// console.log(startApp().userName)

var state = startApp()

if(state.obj?.name){
    console.log("hi!")
    // document.body.bgColor = ""
    document.body.classList.add("game")
    reloadScript("../scripts/game.js")
}
else{
    const {form, user} = renderForm() //obj decunstuction

    form.addEventListener("submit", (e) => {
        e.preventDefault()

        state.obj['name'] = user.value
        form.remove()

        localStorage.setItem("user", JSON.stringify(state.obj))
        reloadScript("../scripts/main.js")
    })
}

function reloadScript(src) {
    const old = document.querySelector(`script[src^="${src}"]`)
    if (old) old.remove()
    
    const script = document.createElement("script")
    script.src = `${src}?v=${Date.now()}`
    script.defer = true
    document.body.appendChild(script)
}

function startApp(){
    const obj = JSON.parse(localStorage.getItem("user") || "{}") 
    // const userName = obj?.name //optional chaining

    return {
        obj
        // userName
    }
}


function renderForm() {
    const form = document.createElement("form")
    form.id = "start-form"
  
    const div = document.createElement("div")
  
    const heading = document.createElement("h1")
    heading.textContent = "Enter Name"
  
    const user = document.createElement("input")
    user.placeholder = "Name"
    user.required = true
    user.type = "text"

    const submit = document.createElement("input")
    submit.type = "submit"
    submit.value = "Start"
  
    div.append(heading, user, submit)
    form.appendChild(div)
    document.body.appendChild(form)
  
    return { form, user }
  }