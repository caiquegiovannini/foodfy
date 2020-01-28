const recipes = document.querySelectorAll('.recipe')
const showHideButton = document.querySelectorAll('.show-hide')
const content = document.querySelectorAll('.step-content')
const menuItens = document.querySelectorAll('.menu a')
const searchField = document.querySelector('.page-header form')
const adminMenuItens = document.querySelectorAll('.menu-admin a')
const currentPage = location.pathname

for (let recipe of recipes) {
    recipe.addEventListener('click', function() {
        const recipeId = recipe.id
        
        window.location.href = `/recipes/${recipeId}`
    })
}

// Botão mostrar e esconder
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

// Destaca o local no menu
for (item of menuItens) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

for (item of adminMenuItens) {
    if (currentPage.includes(item.getAttribute('href'))) {
        item.classList.add('active')
    }
}

// Esconde o campo de busca dependendo da pagina
if (currentPage.includes('about') || currentPage.includes('chefs')) {
    searchField.classList.add('hide')
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

// Paginação
const searchButton = document.querySelector('.search-button')
const searchInput = document.querySelector('.search-input')

searchButton.addEventListener('click', function() {
    const search = searchInput.textContent

    window.location = `/search?filter=${search}`
})

function paginate(selectedPage, totalPages) {

    let pages = [],
        oldPage  // pagina anterior ao currentPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {

        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if (firstAndLastPage || pagesAfterSelectedPage && pagesBeforeSelectedPage) {

            if (oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if (oldPage && currentPage - oldPage == 2) {
                pages.push(currentPage - 1)
            }

            pages.push(currentPage)

            oldPage = currentPage

        }
    }
    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)

    let elements = ""

    for (let page of pages) {
        if (String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if( filter ) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }

    pagination.innerHTML = elements
}

const pagination = document.querySelector('.pagination')

if (pagination) {
    createPagination(pagination)
}