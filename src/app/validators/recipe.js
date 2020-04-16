const LoadRecipeService = require('../services/LoadRecipeService')

async function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (key != 'information' && req.body[key] == "") {
            return res.send('Por favor, volte e preencha todos os campos.')
        }
    }

    if (!req.files || req.files.length == 0)
        return res.send('Por favor, envie pelo menos 1 imagem.')

    next()
}

async function show(req, res, next) {
    const recipe = await LoadRecipeService.load('recipe', { where: {id: req.params.id}})
    
    if (!recipe) return res.send('Receita não encontrada!')

    req.recipe = recipe

    next()
}

async function edit(req, res, next) {
    const recipe = await LoadRecipeService.load('recipe', { where: {id: req.params.id}})

    if (!recipe) return res.send('Receita não encontrada!')

    req.recipe = recipe

    next()
}

async function update(req, res, next) {
    try {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (key != 'information' && key != 'removed_files' && req.body[key] == "") {
                return res.send('Por favor, volte e preencha todos os campos.')
            }
        }

        next()
        
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    post,
    show,
    edit,
    update
}