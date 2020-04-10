const Recipe = require('../models/Recipe')

async function getFieldsValues(req) {
    results = await Recipe.chefSelectOptions()
    const chefOptions = results.rows

    //get images
    results = await Recipe.files(req.body.id)
    let files = results.rows
    files = files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
    }))

    const values = {
        chefOptions,
        files
    }

    return values
}

async function checkAllFields(req) {
    const keys = Object.keys(req.body)

    const { chefOptions, files } = await getFieldsValues(req)

    for (key of keys) {
        if (key != 'information' && key != 'removed_files' && req.body[key] == "") {
            return {
                recipe: req.body,
                chefOptions,
                files,
                error: 'Os campos com * são obrigatórios!'
            }
        }
    }
}

async function post(req, res, next) {
    const fillAllFields = await checkAllFields(req)
    if (fillAllFields) {
        return res.render('admin/recipe/create', fillAllFields)
    }

    const { chefOptions } = await getFieldsValues(req)

    if (req.files.length == 0)
        return res.render('admin/recipe/create', {
            recipe: req.body,
            chefOptions,
            error: 'Envie pelo menos 1 foto'
        })

    next()
}

async function show(req, res, next) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]
    
    if (!recipe) return res.send('Receita não encontrada!')

    req.recipe = recipe

    next()
}

async function edit(req, res, next) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if (!recipe) return res.send('Receita não encontrada!')

    req.recipe = recipe

    next()
}

async function update(req, res, next) {
    try {
        const fillAllFields = await checkAllFields(req)
        if (fillAllFields) {
            return res.render('admin/recipe/edit', fillAllFields)
        }
    
        const { chefOptions, files } = await getFieldsValues(req)

        if (req.files.length == 0 && files.length == 0) {
            return res.render('admin/recipe/edit', {
                recipe: req.body,
                chefOptions,
                error: 'Envie pelo menos 1 foto'
            })
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