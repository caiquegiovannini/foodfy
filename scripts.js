const recipes = document.querySelectorAll('.recipe')
const modalOverlay = document.querySelector('.modal-overlay')

for (let recipe of recipes) {
    recipe.addEventListener('click', function() {
        modalOverlay.classList.add('active')

        modalOverlay.querySelector('img').src = recipe.querySelector('img').src
        modalOverlay.querySelector('img').alt = recipe.querySelector('img').alt
        modalOverlay.querySelector('.modal-recipe-name').innerHTML = recipe.querySelector('.recipe-name').innerHTML
        modalOverlay.querySelector('.modal-recipe-author').innerHTML = recipe.querySelector('.recipe-author').innerHTML
    })
}

// Close modal //
modalOverlay.querySelector('a').addEventListener('click', function() {
    modalOverlay.classList.remove('active')
}) 