const recipes = document.querySelectorAll('.recipe')
const adminRecipes = document.querySelectorAll('.admin-recipe')
const showHideButton = document.querySelectorAll('.show-hide')
const content = document.querySelectorAll('.step-content')


for (let recipe of adminRecipes) {
    recipe.querySelector('a').addEventListener('click', function() {
        const recipeId = recipe.id

        window.location = `/admin/recipes/${recipeId}`
    })
}

for (let recipe of recipes) {
    recipe.addEventListener('click', function() {
        const recipeId = recipe.id
        
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

// Adicionar novos ingredientes
function addIngredient() {
    const ingredients = document.querySelector('#ingredients')
    const fieldContainer = document.querySelectorAll('.ingredient')

    // Realiza um clone do último ingrediente adicionado
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    ingredients.appendChild(newField)
}

document.querySelector('.add-ingredient').addEventListener('click', addIngredient)

// Adicionar modo de preparo
function addPreparation() {
    const preparation = document.querySelector('#preparation')
    const fieldCOntainer = document.querySelectorAll('.step')

    // Realiza um clone da última etapa adicionada
    const newField = fieldCOntainer[fieldCOntainer.length - 1].cloneNode(true)

    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == "") return false

    // Deixa o valor do input vazio
    newField.children[0].value = ""
    preparation.appendChild(newField)
}

document.querySelector('.add-preparation').addEventListener('click', addPreparation)