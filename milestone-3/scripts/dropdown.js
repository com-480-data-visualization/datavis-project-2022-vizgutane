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

    var cuisines = d3.map(data, function(d){return(d.cuisine)})
    console.log(cuisines)
    let cuisineBtn = document.getElementById('dropDownBtn')
    let grid = document.getElementById("dropDownGrid")

    cuisineBtn.addEventListener('click',e =>{
        let options = cuisines.map(cuisine => '<div><button class="cuisine-link">'+cuisine+'</button></div>').join('\n')

        grid.innerHTML = options; 
    })
    cuisineBtn.addEventListener('hover',e =>{
        let options = cuisines.map(cuisine => '<div><button class="cuisine-link">'+cuisine+'</button></div>').join('\n')

        grid.innerHTML = options; 
    })
})



