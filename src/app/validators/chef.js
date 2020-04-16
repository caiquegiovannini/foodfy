const LoadChefService = require('../services/LoadChefService')
const LoadRecipeService = require('../services/LoadRecipeService')

async function getFieldsValues(req) {
    const id = req.params.id || req.body.id
    let chef = await LoadChefService.load('chef', { where: {id} })

    return chef
}

async function checkAllFields(req) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key != "removed_files") {
            return {
                chef: req.body,
                error: 'Todos os campos são obrigatórios!'
            }
        }
    }
}

async function post(req, res, next) {
    const fillAllFields = await checkAllFields(req)
    if (fillAllFields) {
        return res.render('admin/chef/create', fillAllFields)
    }

    if (!req.file) return res.render('admin/chef/create', {
        chef: req.body,
        error: 'Selecione uma foto de avatar.'
    })

    next()
}

async function chefDontExists(req, res, next) {
    const chef = await getFieldsValues(req)

    const chefs = await LoadChefService.load('chefs')
    
    if (!chef) return res.render('admin/chef/index', {
        chefs,
        error: 'Chef não encontrado.'
    })

    req.chef = chef

    next()
}

async function update(req, res, next) {
    try {
        let fillAllFields = await checkAllFields(req)

        if (fillAllFields) {
            fillAllFields = {
                ...fillAllFields
            }

            return res.render('admin/chef/edit', fillAllFields)
        }

        next()
    } catch (error) {
        console.error(error)
    }
}

async function remove(req, res, next) {
    const recipes = await LoadRecipeService.load('recipes', { where: {chef_id: req.body.id}})
    const chef = await getFieldsValues(req)

    
    if (recipes.length != 0) {

        return res.render('admin/chef/edit', { 
            chef,
            error: 'Chefs com receitas cadastradas não podem ser deletados!'
        })
    }

    req.chef = chef

    next()
}

module.exports = {
    post,
    chefDontExists,
    update,
    remove
}