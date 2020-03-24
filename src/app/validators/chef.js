const Chef = require('../models/Chef')

async function getFieldsValues(req) {
    const id = req.params.id || req.body.id
    let results = await Chef.find(id)
    const chef = results.rows[0]

    results = await Chef.file({ where: {id: chef.file_id} })
    let avatar = results.rows[0]

    avatar = {
        ...avatar,
        src: `${req.protocol}://${req.headers.host}${avatar.path.replace("public", "").replace("\\images\\", "/images/")}`
    }

    return {
        chef,
        avatar
    }
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
    const { chef } = await getFieldsValues(req)

    results = await Chef.all()
    let chefs = results.rows
    chefs = chefs.map(chef => ({
            ...chef,
            path: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "").replace("\\images\\", "/images/")}`
        }))
    
    if (!chef) return res.render('admin/chef/index', {
        chefs,
        error: 'Chef não encontrado.'
    })

    req.chef = chef

    next()
}

async function update(req, res, next) {
    let fillAllFields = await checkAllFields(req)

    if (fillAllFields) {
        const { avatar } = await getFieldsValues(req)
        console.log(avatar)
        fillAllFields = {
            ...fillAllFields,
            avatar
        }

        return res.render('admin/chef/edit', fillAllFields)
    }

    next()
}

async function remove(req, res, next) {
    let results = await Chef.findRecipesByChef(req.body.id)
    const recipes = results.rows

    const { chef, avatar } = await getFieldsValues(req)
    
    if (recipes.length != 0) {

        return res.render('admin/chef/edit', { 
            chef, 
            avatar,
            error: 'Chefs com receitas cadastradas não podem ser deletados!'
        })
    }

    req.chef = {
        chef,
        avatar
    }

    next()
}

module.exports = {
    post,
    chefDontExists,
    update,
    remove
}