//Add click listener for dropDown button
document.addEventListener('click', e =>{
    const isDropDownBtn = e.target.matches("[data-dropdown-button]")
    if (!isDropDownBtn && e.target.closest("[data-dropdown]") != null) return
 
    let currentDropDown
    if (isDropDownBtn) {
        currentDropDown = e.target.closest("[data-dropdown]")
        currentDropDown.classList.toggle("active")
    }

})

d3.csv("./milestone-3/data/cuisine_aggregates.csv").then( function(data) {
    //Extract cuisines from csv
    var cuisines = d3.map(data, function(d){return(d.cuisine)})
    let dropDownBtn = document.getElementById('dropDownBtn')
    let grid = document.getElementById("dropDownGrid")

    
    dropDownBtn.addEventListener('click',() =>{
        //Dynamically add cuisine names as button elements
        let options = cuisines.map(cuisine => '<div><button class="cuisine-link">'+cuisine+'</button></div>').join('\n')
        grid.innerHTML = options; 
        
        //Add ClickListeners for newly added cuisine buttons
        let btns = document.getElementsByClassName("cuisine-link")
        for(const btn of btns){
            btn.addEventListener('click', function (){
                let dishes = document.getElementById("dishes")
                const tag = document.createElement("div")
                const text = document.createTextNode(btn.textContent)

                //Clear the children of dishes 
                dishes.innerHTML = ""

                //Close the dropdown menu
                dropDownBtn.click()

                //Append new child element to dishes
                tag.appendChild(text)
                dishes.appendChild(tag)
            })
       }
    })
})



