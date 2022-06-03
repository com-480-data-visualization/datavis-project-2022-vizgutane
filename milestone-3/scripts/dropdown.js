//Add click listener for dropdown button
document.addEventListener('click', e =>{
    const isDropDownBtn = e.target.matches("[data-dropdown-button]")
    if (!isDropDownBtn && e.target.closest("[data-dropdown]") != null) return
 
    let currentDropDown;
    if (isDropDownBtn) {
        currentDropDown = e.target.closest("[data-dropdown]")
        currentDropDown.classList.toggle("active")
    }
})

var cuisine_aggregates = d3.csv("./milestone-3/data/cuisine_aggregates.csv")
var yummly = d3.csv("./milestone-3/data/recipes_subset.csv")

Promise.all([cuisine_aggregates, yummly]).then(function([data, recipes]){ 
   
    // Extract cuisines from data & get html refs
    var cuisines = data.map(dict => dict.cuisine)
    let dropDownBtn = document.getElementById('dropDownBtn')
    let grid = document.getElementById("dropDownGrid")
    let recipe_header = document.getElementById("recipe_header")
    let recipe_ingredients = document.getElementById("recipe_ingredients")
    let cooking_time = document.getElementById("recipe_cooking_time")

    // Adding event listeners to each button 
    dropDownBtn.addEventListener('click', () =>{
        let options = cuisines.map(cuisine => '<div><button class="cuisine-link">'+cuisine+'</button></div>').join('\n')
        grid.innerHTML = options; 
        
        // Add potential update of html elements in the case of click
        let btns = document.getElementsByClassName("cuisine-link")
        for(const btn of btns){
            btn.addEventListener('click', function (){
                recipe = recipes.filter(dict => dict.cuisine == btn.textContent)[0]
                recipe_header.innerHTML = recipe.dish_name
                console.log(JSON.parse(recipe.ingredients).map(ingredient => "<li>" + ingredient + "</li>"))
                recipe_ingredients.innerHTML = "<ul>"
                JSON.parse(recipe.ingredients).forEach(ingredient => {
                    recipe_ingredients.innerHTML += "<li>" + ingredient + "</li>"
                })
                recipe_ingredients.innerHTML += "</ul>"
                cooking_time.innerHTML = "Cooking time: " + recipe.time_s / 60 + " minutes"
                dropDownBtn.click()
            })
       }
    })
})



