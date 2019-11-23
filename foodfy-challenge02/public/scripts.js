const recipes = document.querySelectorAll('.recipe')
const showHideButton = document.querySelectorAll('.show-hide')
const content = document.querySelectorAll('.step-content')


for (let recipe of recipes) {
    recipe.addEventListener('click', function() {
        const recipeId = recipe.getAttribute('id')
        
        window.location.href = `/recipes/${recipeId}`
    })
}

for (let i = 0; i < showHideButton.length; i++) {
    showHideButton[i].addEventListener('click', function() {
        if (showHideButton[i].textContent == 'ESCONDER') {
            showHideButton[i].textContent = 'MOSTRAR'
        } else {
            showHideButton[i].textContent = 'ESCONDER'
        }
        content[i].classList.toggle('hide')
    })
}