const recipes = document.querySelectorAll('.recipe')
const showHideButton = document.querySelectorAll('.show-hide')
const content = document.querySelectorAll('.step-content')
const menuItens = document.querySelectorAll('.menu a')
const searchField = document.querySelector('.page-header form')
const adminMenuItens = document.querySelectorAll('.menu-admin a')
const currentPage = location.pathname

for (let recipe of recipes) {
    recipe.addEventListener('click', () => {
        const recipeId = recipe.id
        
        window.location.href = `/recipes/${recipeId}`
    })
}

// Botão mostrar e esconder
for (let i = 0; i < showHideButton.length; i++) {
    showHideButton[i].addEventListener('click', () => {
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
if (searchField) {
    if (currentPage.includes('about') || currentPage.includes('chefs')) {
        searchField.classList.add('hide')
    }
}

const RecipeFields = {
    // Adicionar novos ingredientes
    addIngredient() {
        const ingredients = document.querySelector('#ingredients')
        const fieldContainer = document.querySelectorAll('.ingredient')

        // Realiza um clone do último ingrediente adicionado
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)

        // Não adiciona um novo input se o último tem um valor vazio
        if (newField.children[0].value == "") return false

        // Deixa o valor do input vazio
        newField.children[0].value = ""
        ingredients.appendChild(newField)
    },
    // Adicionar modo de preparo
    addPreparation() {
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
}

// Paginação
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

// Uploads
const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    path: "",
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        Array.from(fileList).forEach(file => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const container = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(container)
            }
            
            reader.readAsDataURL(file)
        })
        
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosContainer = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosContainer.push(item)
            }
        })

        const totalPhotos = fileList.length + photosContainer.length
        if (totalPhotos > uploadLimit) {
            alert('Você atingiu o limite máximo de fotos')
            event.preventDefault()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },
    getContainer(image) {
        const container = document.createElement('div')
        container.classList.add('photo')

        container.onclick = PhotosUpload.removePhoto

        container.appendChild(image)

        container.appendChild(PhotosUpload.getRemoveButton())

        return container
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoContainer = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoContainer)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoContainer.remove()
    },
    removeOldPhoto(event) {
        const photoContainer = event.target.parentNode
        
        if (photoContainer.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoContainer.id},`
            }
        }

        photoContainer.remove()
        
    }
}

// Image Select
const PhotoSelected = {
    mainPhoto: document.querySelector('.full-recipe_image img'),
    highlights: document.querySelectorAll('.full-recipe_highlights img'),
    highlightPhoto(event) {
        const selected = event.target

        for (image of PhotoSelected.highlights) {
            image.classList.remove('selected')
        }

        selected.classList.add('selected')

        PhotoSelected.mainPhoto.src = selected.src
        PhotoSelected.mainPhoto.alt = selected.alt
    }
}

// Validates
const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)

        let results = Validate[func](input.value)

        input.value = results.value

        if (results.error)
            Validate.displayError(input, results.error)

    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)

        input.parentNode.querySelector('input').classList.add('border-error')

        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error')
        if (errorDiv)
            errorDiv.remove()
            input.parentNode.querySelector('input').classList.remove('border-error')
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(mailFormat))
            error = 'Email inválido'

        return {
            error,
            value
        }
    }
}